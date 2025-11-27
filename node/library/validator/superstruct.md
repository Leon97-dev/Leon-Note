# Superstruct — 초간결 유효성 검사 라이브러리

_참고 사이트_
https://docs.superstructjs.org/

---

# 1. 개요

Superstruct는 아주 가벼운 구조 기반(structural) 유효성 검사 라이브러리다.
스키마가 단순하고 직관적이며, Zod보다 문법이 더 짧고 가볍다.

npm i superstruct ✅ 설치 필요

---

# 2. 주요 특징

Zod처럼 스키마가 곧 타입이 되는 수준은 아니지만, 문법 자체는 상당히 심플하다.

- 초간단 문법
- 브라우저/Node 모두 사용 가능
- 런타임 검증 중심 (TS 자동 타입 생성은 제한적)
- 가볍고 빠름
- 객체 형태 그대로 모양을 선언하는 구조(struct) 방식

---

# 3. 기본 사용법

**< 스키마 정의 >**

```js
import { object, string, number } from 'superstruct';

const User = object({
  name: string(),
  age: number(),
});
```

**< 검증하기 >**

```js
import { validate } from 'superstruct';

const [error, value] = validate(data, User);

if (error) {
  console.log(error);
}
```

validate는 [error, value] 형태로 반환한다.

---

# 4. 자주 쓰는 구조(struct)

```js
string()
number()
boolean()
array(string())
object({ ... })
nullable(string())
optional(number())
literal('A')     // enum-like
union([string(), number()])
```

---

# 5. 커스텀 구조 만들기

```js
import { define, number } from 'superstruct';

const Positive = define('Positive', (value) => {
  return number().validate(value)[0] === undefined && value > 0;
});

// 사용
const Schema = object({
  amount: Positive(),
});
```

---

# 6. Express에서의 사용 예시

```js
const validateStruct = (schema) => (req, res, next) => {
  const [error, value] = validate(req.body, schema);
  if (error) return res.status(400).json({ message: error.message });
  req.validated = value;
  next();
};
```
