# Node.js Prisma — ORM & Database Client 스택

_참고 사이트_
https://www.prisma.io/docs

---

# 1. 개요

Prisma는 Node.js 환경에서 사용하는 현대적인 ORM(객체-관계 매핑) + DB Client 스택이다.
두 개의 패키지가 함께 움직인다.

- prisma → CLI · schema · migrate · generate 담당
- @prisma/client → 애플리케이션 코드에서 실제 DB와 통신하는 클라이언트

Prisma의 핵심은
“스키마로 DB 모델을 선언하고, 자동 생성된 클라이언트를 사용해 안전하게 쿼리하는 방식”

npm i prisma @prisma/client ✅ 설치 필요

---

# 2. prisma (CLI) 역할

prisma는 “개발자 도구”라고 보면 된다.

- schema.prisma 파일 생성/관리
- migrate → DB에 테이블 생성/변경 적용
- generate → @prisma/client 자동 생성
- studio → DB GUI 툴 제공

**< 주요 CLI 명령어 >**
commands 파일 참고

---

# 3. @prisma/client 역할

애플리케이션 코드에서 실제 쿼리를 보내는 DB 클라이언트다.

```js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
```

**< 기본 쿼리 예시 >**

```js
const products = await prisma.product.findMany();

const newProduct = await prisma.product.create({
  data: {
    name: 'MacBook M3',
    price: 3300000,
  },
});
```

---

# 4. Prisma schema 구조

/prisma/schema.prisma 파일에서 모델 정의

```prisma
model Product {
  id        Int     @id @default(autoincrement())
  name      String
  price     Int
  createdAt DateTime @default(now())
}
```

자세한 정보는 Prisma 파일 참고

---

# 5. Prisma의 장점 (실무 기준)

- 타입 자동 생성 (TypeScript 친화적)
- raw SQL보다 안전하고 유지보수성이 높음
- schema 기반이라 구조가 명확함
- 쿼리가 직관적이며 자동완성 정확도 최고
- 마이그레이션 관리가 쉬움

---

# 6. 자주 하는 실수

- schema 변경 후 generate 안해서 타입 안 맞음
- DATABASE_URL 잘못 설정해서 마이그레이션 오류
- prisma studio 실행 시 DB 연결 안 맞음
- PrismaClient 여러 번 생성해서 too many connections 에러 발생 -> 싱글톤 관리
