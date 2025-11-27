# Zod — 타입 안전 타입스크립트 친화 유효성 검사기

_참고 사이트_
https://zod.dev/

---

# 1. 개요

Zod는 모던한 방식으로 설계된 TS/JS 유효성 검사 라이브러리다.
특히 TypeScript와 궁합이 매우 좋다.
프론트, 백 어디서든 사용할 수 있고, 스키마 자체가 타입으로 변환된다.

npm i zod ✅ 설치 필요

---

# 2. 주요 역할

Joi보다 “현대적이고 타입 중심” 느낌이 강하다.

- 객체/배열/문자열/커스텀 타입 검증
- 유효성 검사 스키마를 TS 타입으로 자동 변환
- 프론트/백에서 동일한 스키마 공유
- 에러 메시지 구조적 제공

---

# 3. 기본 사용법

**< 스키마 정의 >**

```js
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
});
```

**< 검증하기 >**

```js
const result = productSchema.safeParse(req.body);

if (!result.success) {
  return res.status(400).json(result.error.issues);
}

const data = result.data; // 검증 완료된 안전한 데이터
```

---

# 4. TypeScript와 연동 (강점)

```ts
type Product = z.infer<typeof productSchema>;
```

스키마가 곧 타입이 된다 → 타입 정의가 중복되지 않음

---

# 5. 자주 쓰는 타입

```js
z.string()
z.number()
z.boolean()
z.array(z.string())
z.enum(['A', 'B'])
z.date()
z.object({ ... })
z.union([z.string(), z.number()])
z.optional()
z.nullable()
```

---

# 6. Express 미들웨어로 사용

```js
const validate = (schema) => (req, res, next) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.issues);
  }
  req.validated = parsed.data;
  next();
};

router.post('/', validate(productSchema), controller.create);
```
