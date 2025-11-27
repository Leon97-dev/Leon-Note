# Node.js pg — PostgreSQL 로우레벨 드라이버

_참고 사이트_
https://node-postgres.com/

---

# 1. 개요

pg는 Node.js에서 PostgreSQL에 직접 연결하기 위한 저수준 드라이버다.
Prisma를 쓰지 않고 SQL을 직접 작성해야 할 때 사용한다.

npm i pg ✅ 설치 필요

---

# 2. 기본 사용 구조

```js
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const result = await pool.query('SELECT * FROM products');
console.log(result.rows);
```

- Pool: 연결 풀
- query: 문자열 SQL 직접 작성

---

# 3. Prisma와 비교

- `prisma`
  \_ 쿼리: JS 메서드 기반
  \_ 타입: 자동 생성
  \_ 마이그레이션: prisma migrate
  \_ 난이도: 쉬움

- `pg`
  \_ 쿼리: SQL 문자열 직접 작성
  \_ 타입: 직접 관리
  \_ 마이그레이션: 직접 SQL 스크립트
  \_ 난이도: 비교적 어려움

대부분의 실무에서는 Prisma가 기본이다.
pg는 “SQL 직접 컨트롤이 필요한 특수 상황”에서만 사용된다.
