# superstruct 기본 개념

_superstruct란?_

“클라이언트가 API에 보낸 JSON이 올바른지 미리 검증하는 코드”

- `예시`: /users에 POST 요청이 들어올 때
  \_ email이 올바른 형식인가?
  \_ firstName이 30자 이하인가?
  \_ price가 음수는 아닌가?
  \_ category가 enum에 없는 값은 아닌가?

이런 걸 DB에 넣기 전에 체크해서, 잘못된 입력을 사전에 막는 게 목적이다.
**즉, 유효성 검사라고 보면 된다. 보통 validator 폴더에 둔다.**

_코드 분석_

1️⃣ 상단 import 설명

```js
import * as s from 'superstruct';
import isEmail from 'is-email';
import isUuid from 'is-uuid';
```

- `superstruct`: JS 객체의 구조와 타입을 정의하고 검증하는 라이브러리
  (유효성 검사용 mini-schema builder)
- `is-email, is-uuid`: 형식 검사용 외부 함수들

2️⃣ enum 상수 정의

```js
const CATEGORIES = [
  'FASHION',
  'BEAUTY',
  'SPORTS',
  'ELECTRONICS',
  'HOME_INTERIOR',
];
const STATUSES = ['PENDING', 'COMPLETE'];
```

Prisma 모델의 enum Category와 1:1로 맞춰야 한다.
항상 동일해야 데이터 불일치가 발생하지 않고,
프론트엔드에서 form으로 보낼 때, category 값이 이 배열 중 하나가 아니면 바로 에러 발생한다.

3️⃣ 커스텀 타입 정의

```js
const Uuid = s.define('Uuid', (v) => isUuid.v4(v));
```

UUID 형식을 검사하는 사용자 정의 타입이다.
isUuid.v4(v)가 true면 통과, 아니면 실패

4️⃣ CREATE 요청

```js
export const CreateUser = s.object({
  email: s.define('Email', isEmail),
  firstName: s.size(s.string(), 1, 30),
  lastName: s.size(s.string(), 1, 30),
  address: s.string(),
  userPreference: s.object({
    receiveEmail: s.boolean(),
  }),
});
```

5️⃣ PATCH 요청

```js
export const PatchUser = s.partial(CreateUser);
```

s.partial()은 모든 필드를 optional로 바꿔준다.
**즉, 일부 수정이 가능하게 해주는 것이니 필수다.**

6️⃣ 실무에서 자주 쓰이는 이유

- `잘못된 요청 방지`: DB까지 오기 전에 유효성 에러 차단
- `프론트 입력 검증과 일관성 유지`: enum, 길이 제한 등을 동일하게 관리 가능
- `빠른 에러 응답`: “invalid email” 같은 즉시 피드백
- `Prisma와 구조 맞춤`: schema.prisma의 타입 규칙과 동일하게 유지

_======================================================================================_

# 자주 쓰이는 Validation DSL

- `s.string()`: 문자열 타입 ✅

- `s.number()`: 숫자 타입 (정수·실수) ✅

- `s.boolean()`: true/false

- `s.size(schema, min, max)`: 숫자 타입 (정수·실수) ✅

- `s.min(schema, value)`: 숫자 최소값 제한 ✅

- `s.max(schema, value)`: 숫자 최대값 제한

- `s.object({...})`: 객체 구조 정의 ✅

- `s.array(schema)`: 배열 정의 (내부 타입 지정)

- `s.enum(['A','B','C'])`: 지정된 값만 허용

- `s.optional(schema)`: 필수 아님 (없어도 통과) ✅

- `s.nullable(schema)`: null 허용

- `s.union([ ... ])`: 여러 타입 중 하나 허용

- `s.partial(schema)`: 모든 필드를 optional 처리 ✅

- `s.pick(schema, ['field1', ...])`: 특정 필드만 추출

- `s.omit(schema, ['field'])`: 특정 필드 제외

- `s.define('Name', fn)`: 사용자 정의 검증 함수 등록

- `s.email()`: 이메일 형식 검증 (라이브러리 지원 시)

- `s.literal(value)`: 특정 값만 허용

- `s.any()`: 모든 타입 허용

- `s.never()`: 절대 통과 불가 (타입 제한용)

_Tip_

- **s.optional() vs s.nullable()은 다르다.**
  \_ `optional`: 필드가 “없어도” 됨
  \_ `nullable`: 필드가 “있지만 null일 수 있음”
  \_ 필요하면 둘 다 조합 가능: `s.optional(s.nullable(s.string()))`

- `s.union()`: string | number 같은 TypeScript 유니언의 실제 구현체다.

- `s.define()`: 프로젝트 공통 규칙(예: Email, UUID, PhoneNumber)을 모듈 단위로 재사용할 때 유용하다.
