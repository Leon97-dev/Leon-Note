# Joi — 객체 스키마 기반 유효성 검사 라이브러리

_참고 사이트_
https://joi.dev/

---

# 1. 개요

Joi는 Node.js에서 가장 오래되고 널리 쓰이는 객체 스키마 기반 유효성 검사 라이브러리다.
형식 검증, 길이 제한, 패턴 검사 등을 “스키마”로 선언하고 데이터를 검증한다.

npm i joi ✅ 설치 필요

---

# 2. 주요 역할

Express에서 입력 데이터 검증을 위해 가장 자주 쓰인다.

- 요청(req.body, params, query) 검증
- 문자열/숫자/배열/객체 등 타입 유효성 체크
- pattern(정규식), min/max, enum 같은 조건 설정
- 에러 메시지 자동 생성

---

# 3. 기본 사용법

**< 스키마 정의 >**

```js
import Joi from 'joi';

const productSchema = Joi.object({
  name: Joi.string().min(1).required(),
  price: Joi.number().integer().positive().required(),
});
```

**< 검증하기 >**

```js
const { error, value } = productSchema.validate(req.body);

if (error) {
  return res.status(400).json({ message: error.message });
}
```

---

# 4. 자주 쓰는 타입

```js
Joi.string(); // 문자열
Joi.number(); // 숫자
Joi.boolean(); // 불리언
Joi.array(); // 배열
Joi.object(); // 객체
Joi.date(); // 날짜
Joi.valid('A', 'B'); // enum
```

---

# 5. 유용한 메서드

```js
Joi.string().email();
Joi.string().pattern(/^[a-z0-9]{4,}$/);
Joi.number().min(1).max(100);
Joi.array().items(Joi.string());
Joi.object().unknown(true); // 선언되지 않은 키 허용
```

---

# 6. Express에서의 미들웨어 예시

```js
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });
  next();
};

router.post('/', validate(productSchema), controller.create);
```
