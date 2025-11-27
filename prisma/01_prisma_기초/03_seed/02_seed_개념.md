# seed 기본 개념

_seed(시드)란?_

“씨앗을 심는다”는 뜻처럼, 데이터베이스에 초기값을 심는 파일이다.
보통 개발 환경(DB가 비어있을 때) 기본 유저, 상품, 테스트 주문 등을 자동으로 넣어주는 스크립트다.

_코드 순서_

1️⃣ PrismaClient 생성

```js
const prisma = new PrismaClient();
```

2️⃣ 기존 데이터 삭제

```js
await prisma.orderItem.deleteMany();
await prisma.order.deleteMany();
await prisma.userPreference.deleteMany();
await prisma.user.deleteMany();
await prisma.product.deleteMany();
```

DB를 초기화(Reset) 하는 단계로,
모든 테이블의 기존 데이터를 비워서 “중복 데이터 없이 새로 심을 수 있게” 하는 것이다.
**그리고 순서가 중요하다!**
**외래키(FK) 때문에 자식(참조하는 쪽) → 부모(참조되는 쪽) 순서로 지워야 에러가 안난다.**

3️⃣ 목데이터 삽입 (mock.js에서 불러온 배열)

```js
await prisma.product.createMany({
  data: PRODUCTS,
  skipDuplicates: true,
});
```

- `createMany()`: 여러 데이터를 한 번에 넣는 함수다.
- `skipDuplicates: true`: 같은 ID나 unique 필드가 이미 있으면 건너뛰고 계속 진행하게 해준다.
  \_ 개발 중 seed를 여러 번 실행해도 에러 없이 유지된다.

4️⃣ 사용자 데이터

```js
await Promise.all(
  USERS.map(async (user) => {
    await prisma.user.create({ data: user });
  })
);
```

- `Promise.all()`: 여러 create 요청을 병렬로 실행해서 속도가 향상된다.

5️⃣ 나머지 테이블 삽입

```js
await prisma.userPreference.createMany({
  data: USER_PREFERENCES,
  skipDuplicates: true,
});
await prisma.order.createMany({ data: ORDERS, skipDuplicates: true });
await prisma.orderItem.createMany({ data: ORDER_ITEMS, skipDuplicates: true });
```

**여기서도 순서가 중요하다!**
\_ userPreference는 user가 존재해야 생성됨
\_ order는 user가 있어야 생성됨
\_ orderItem은 order와 product가 있어야 생성됨
**즉, 부모 → 자식 순서로 진행해야 FK 에러가 없다.**

6️⃣ 연결 종료

```js
await prisma.$disconnect();
```

모든 쿼리 끝나면 DB 연결을 닫는 필수 코드다.
안 닫으면 프로세스가 계속 떠있거나, `“PrismaClient is already connected”` 경고 발생

7️⃣ 예외 처리

```js
.catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
```

실행 중 에러가 나면 로그 출력하고 연결 닫은 뒤 강제 종료한다.
항상 `try–catch` 또는 `.catch()`로 Prisma 연결을 마무리해야 안전하다.

8️⃣ 실무에서 자주 쓰이는 이유

- `빠른 개발 세팅`: DB 초기화 + 샘플데이터 자동 주입
- `테스트 용이`: 매 테스트마다 동일한 초기 상태 재현 가능
- `배포 초기 데이터`: 관리자 계정, 기본 설정 등 자동 생성 가능
- `CI/CD 자동화`: 배포 시 “seed → migrate → test” 파이프라인에서 실행
