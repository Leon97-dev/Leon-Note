# Validation Layer

# 스키마 기반 검증 (Schema Validation)

데이터 구조를 “정의해놓고”, 들어오는 데이터가 그 구조를 지키는지 확인하는 방식.

대표 라이브러리

- Joi
- Yup
- Zod
- Superstruct

특징

- 읽기 쉽다
- 프론트/백 공통으로 쓰기 좋다
- 타입스크립트와 잘 맞아떨어진다
- 현업에서도 여전히 가장 많이 쓰는 축

실무 사용 예시

- REST API body/query/header 검증
- Form 데이터 검증
- Prisma 등 ORM 앞단 검증
- DTO(데이터 전송 객체) 최소 스펙 정의

---

# 단순 조건문 기반 검증 (Manual Validation)

```js
if (!email.includes('@')) throw new Error('잘못된 이메일');
```

이런 식의 “로우레벨 조건검사”

특징

- 가장 원시적
- 빠르게 임시로 검증할 때는 최고
- 하지만 점점 코드가 난잡해지고, 요구사항이 바뀌면 유지보수 헬게이트
- 실무에선 단순 check 정도에 한정

실무 사용 예시

- 로그인 시 username 비었는지 확인
- 관리자 전용 작업인지 확인하는 조건문
- 숫자 범위 간단 검증

---

# 클래스 기반 검증 (Class Validator / DTO 기반)

NestJS 같은 프레임워크에서 유행한 형태

대표 라이브러리

- class-validator
- class-transformer

특징

- 객체(클래스) 안에 검증 룰을 넣는다
- 애노테이션(@IsEmail, @MinLength) 스타일
- NestJS + TypeScript 환경에서 많이 쓰임
- 대규모 서비스에서 DTO 기반 구조 잡힐 때 사용

실무 사용 예시

- Request → DTO 변환 → Service 전달 전 검증
- 대형 프로젝트에서 통일된 구조 필요할 때

---

# 미들웨어 기반 검증 (Express, Fastify 등)

경로마다 검증을 미들웨어로 걸어두는 방식

```js
router.post('/register', validate(schema), controller.register);
```

특징

- Express에서 가장 실전적인 구조
- 스키마 검증 라이브러리와 자연스럽게 조합
- 프로젝트 규모가 커질수록 이 방식을 많이 사용

---

# ORM 레벨 검증 (Prisma, Sequelize 등)

ORM 자체의 제약 조건으로 검증하는 방식

예시

- Prisma: @unique, @default, @updatedAt
- DB 스키마: NOT NULL, CHECK, UNIQUE, FK

특징

- “데이터베이스가 마지막 방어선”
- 백엔드 버그가 있더도 DB가 말도 안 되는 값은 안 받아준다
- 실무에서 매우 중요한 검증층

---

# DB 트리거 + Constraint 기반

DB 수준에서

- CHECK(age > 0)
- UNIQUE(user.email)
- FOREIGN KEY (관계 검증)

특징

- 실무에선 엄청 많이 쓰인다
- 백엔드 레벨의 실수조차 방어
- 고급 개발자들이 신뢰하는 레이어

---

# 타입 기반 검증 (TypeScript Narrowing)

이건 실제 런타임 검증은 아니지만, 개발 과정에서 많은 오류를 잡는다.

예시

- union narrowing
- optional chaining
- interface/ type 체크

특징

- 런타임 보장은 못 하지만, 개발 중 사고 확률을 낮춘다
- TS + Zod 같이 쓰면 매우 강력

---

# 비즈니스 규칙 검증 (Business Rule Validation)

이건 스키마 검증과는 완전히 다르다.

예시

- “남은 재고가 0인데 주문하면 안 된다”
- “직원은 자기 회사 소속 계약만 수정할 수 있다”
- “관리자만 상품 삭제 가능하다”

특징

- if/throw 기반이지만 이건 ‘데이터 구조’가 아니라 ‘도메인 규칙’
- 실무에서 검증의 절반 이상이 이것이다

---

# 요약 정리

프론트
입력값 기본 검증

백엔드 스키마 검증
Zod / Joi / Yup / Superstruct

백엔드 비즈니스 검증
도메인 규칙 판단

ORM 검증
Prisma 스키마 제약 조건

DB 검증
unique / not null / check constraint
