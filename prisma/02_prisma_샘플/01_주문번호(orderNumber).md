# 주문번호(orderNumber) 필드

1️⃣ Prisma 스키마 설계 (실무형)

```prisma
model Order {
  id          String      @id @default(uuid())
  orderNumber String      @unique              // 예: ORD-20251023-001
  status      OrderStatus @default(PENDING)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  user        User?       @relation(fields: [userId], references: [id], onDelete: SetNull)
  userId      String?

  orderItems  OrderItem[]
}

// 날짜별 카운터 테이블 (하루마다 001부터)
model OrderCounter {
  date       DateTime @id       // 00:00 기준 날짜(UTC 또는 KST 한쪽으로 고정)
  lastValue  Int      @default(0)
}
```

- `Order.orderNumber`를 **유니크**로 둬서 중복 방지.
- 날짜별 증가를 위해 `OrderCounter`를 둬서 **경쟁 상황에서도 안전**하게 카운팅.
- `date` 타입은 “해당 날짜 00:00:00”으로 **규칙 통일**(UTC/KST 중 하나 고정).

_왜 Counter 테이블?_
Postgres `SEQUENCE`만 쓰면 “전역 증가”라 **날짜별 리셋**이 번거롭고,
애플리케이션 레벨에서 포맷(YYYYMMDD-###) 제어가 더 쉽기 때문이다.

2️⃣ 주문 생성 로직 (경쟁에 안전한 트랜잭션)
동시에 여러 요청이 와도 같은 번호가 나오면 안 됨 → 트랜잭션 안에서 “해당 날짜의 카운터를 ▲ 증가 →
읽기 → 번호생성 → Order 생성”을 원자적으로 처리한다.

```js
// src/services/order.service.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function fmtDateYYYYMMDD(date) {
  // KST 기준으로 맞추고 싶으면 여기서 보정해도 됨
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

async function createOrder({ userId, items }) {
  const now = new Date();
  const dayKey = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 00:00:00 고정
  const ymd = fmtDateYYYYMMDD(now);

  return await prisma.$transaction(
    async (tx) => {
      // 1) 오늘 날짜 row 잠그고 증가 (upsert + 증가)
      //    upsert 후 update에서 lastValue + 1을 안전히 보장
      const counter = await tx.orderCounter.upsert({
        where: { date: dayKey },
        create: { date: dayKey, lastValue: 1 },
        update: { lastValue: { increment: 1 } },
      });

      // 2) 증가된 번호 사용
      const seq = counter.lastValue; // upsert의 update 반환값은 증가 후 값
      const serial = String(seq).padStart(3, "0");
      const orderNumber = `ORD-${ymd}-${serial}`;

      // 3) 주문 생성 (중첩 생성 가능)
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          items: {
            create: items.map((it) => ({
              productId: it.productId,
              qty: it.qty,
              unitPrice: it.unitPrice,
            })),
          },
        },
        include: { items: { include: { product: true } } },
      });

      return order;
    },
    {
      // Postgres에선 보통 기본 격리로도 충분하지만, 초고경쟁 환경이면 올려도 됨
      // isolationLevel: 'Serializable',
      // maxWait: 5000, timeout: 10000
    }
  );
}

module.exports = { createOrder };
```

- `upsert` + `increment`를 **하나의 트랜잭션**으로 묶어 **경쟁 상태**에서 안전.
- 초고경쟁 환경(초당 수십~수백 RPS)이면 `isolationLevel: 'Serializable'` 고려.
- 날짜 기준(`dayKey`)은 **항상 00:00로 통일**해서 하루 카운터를 안정적으로 식별.

_대안_
SELECT ... FOR UPDATE로 직접 잠그는 방식도 있으나, Prisma에선 위 패턴이 가장 심플 + 안전

3️⃣ API 라우트 (Express)

```js
// src/routes/orders.js
const express = require("express");
const { createOrder, updateOrderStatus } = require("../services/order.service");
const router = express.Router();

// 주문 생성
router.post("/", async (req, res, next) => {
  try {
    const { userId, items } = req.body;
    const order = await createOrder({ userId, items });
    res.status(201).json(order);
  } catch (e) {
    next(e);
  }
});

// 상태 변경 (PENDING -> COMPLETE 등)
router.patch("/:id/status", async (req, res, next) => {
  try {
    const { status } = req.body; // 'PENDING' | 'COMPLETE' | ...
    const order = await updateOrderStatus(req.params.id, status);
    res.json(order);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
```

상태 변경 서비스(전이 규칙 포함)

```js
// src/services/order.service.js (이어짐)
const ALLOWED_TRANSITIONS = {
  PENDING: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["COMPLETE"],
  COMPLETE: [],
  CANCELLED: [],
};

async function updateOrderStatus(orderId, nextStatus) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new Error("Order not found");

  const from = order.status;
  const allowed = ALLOWED_TRANSITIONS[from] ?? [];
  if (!allowed.includes(nextStatus)) {
    const msg = `상태 전이 불가: ${from} -> ${nextStatus}`;
    const err = new Error(msg);
    err.statusCode = 400;
    throw err;
  }

  return await prisma.order.update({
    where: { id: orderId },
    data: { status: nextStatus },
  });
}

module.exports = { createOrder, updateOrderStatus };
```

_이유_
실무에선 “임의의 상태점프 금지”가 중요하다.
전이 규칙을 중앙에서 관리하면 버그·오입력 방지 가능

4️⃣ 상태(enum) 확장 예시

```prisma
enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  COMPLETE
  CANCELLED
}
```

- 모델에는 `status OrderStatus`로 **타입만 참조**하면 끝
- 새 상태를 추가/변경할 땐 **enum만 변경** → 마이그레이션
- 코드의 `ALLOWED_TRANSITIONS`도 함께 업데이트

5️⃣ 실패/재시도 & 중복 방지 팁

- `중복생성`: `orderNumber @unique`가 최종 방어막
  \_ 경쟁 상태에서 드물게 충돌 나면 트랜잭션 안에서 **재시도**(한 번 더 upsert) 전략
- `시간대`: 날짜 키는 **항상 같은 타임존 기준**(KST면 KST)으로 생성
  \_ 서버가 여러 대/여러 리전에 있으면 **서버시간 싱크** 유의
- `취소/환불`: 상태만 바꾸고 **원시 데이터를 절대 삭제하지 않기**(회계/정산/CS 근거)

6️⃣ 대안 아키텍처 (언제 고려?)

- `전역 시퀀스 + 포맷팅`
  \_ `orderSeq BIGSERIAL`로 단순 증가 → 응답 시 `ORD-YYYYMMDD-${seq}` 포맷
  \_ 날짜별 리셋이 필요 없다면 가장 간단/고성능
- `DB 함수/트리거`
  \_ Postgres 함수로 번호 생성 + 트리거로 세팅
  \_ 장점: 앱/DB 일관성, 단점: 관리 복잡도↑ + Prisma 마이그레이션 외부 변경
- `키-밸류 캐시(예: Redis)`
  \_ 초고트래픽에서 카운터를 Redis INCR로 처리 → 최종 저장만 DB
  \_ 단, 캐시 장애/동기화 전략까지 필요 (운영 난이도↑)
