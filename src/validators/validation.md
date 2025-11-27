# Validate 코드 분석

# 1. validate(schema)

schema는 superstruct로 만든 검사 기준.
schema를 받아서 Express가 쓸 미들웨어를 만들어서 반환한다.

```js
export default function validate(schema) {
  return (req, _res, next) => { ... };
}
```

호출할 때는: validate(UserCreateSchema)
동작할 때는: 요청 바디(req.body)를 schema로 검사

---

# 2. assert(req.body, schema)

superstruct의 assert는:
req.body가 schema 규칙에 맞으면 → 아무 일도 안 함
규칙에 어긋나면 → 에러 throw
그래서 try/catch 안에 들어간다.

---

# 3. catch(error) — 어떤 에러인지 파고 들기

superstruct의 에러 구조는 조금 어렵다.
어떤 에러는 error.failures()라는 반복 가능한 객체(iterator)
어떤 에러는 그냥 배열
어떤 에러는 error.path가 존재할 수도 있음
그래서 모든 경우를 대비한 코드다.

“superstruct 오류는 여러 개일 수 있으니, 그중 첫 번째만 딱 잡아내자.”
이게 실무적으로 매우 중요하다.
유저에게 한 번에 10개 에러를 던지는 건 좋은 UX가 아니다.

---

# 4. path 찾기 — 어디서 잘못됐는지

path는 superstruct가 특정 필드에서 에러를 발견했을 때 남기는 정보다.
여기서 join('.') 하는 이유는:
['user','email'] → "user.email"
이렇게 표현해야 클라이언트가 읽기 쉽기 때문이다.
예시:
"price must be >= 0" → price
"articleId must be integer" → articleId

---

# 5. message 결정 — 커스텀 메시지 우선

메시지 우선순위는 이렇게 된다:

1.  직접 만든 커스텀 메시지(map 기반)
2.  superstruct가 제공하는 기본 메시지
3.  마지막 fallback: "요청 데이터가 올바르지 않습니다"

이 구조가 아주 좋은 이유는:
개발자가 원하면 모든 메시지를 커스터마이징할 수 있고,
superstruct 기본 메시지도 살아 있고,
마지막 안전장치도 있어서 에러 누락이 없음

---

# 6. ValidationError(path, message) 던짐

마지막에 커스텀 ValidationError 클래스로 변환한다.
왜냐면:
superstruct 에러는 형태가 들쭉날쭉
Global Error Handler는 ValidationError를 기준으로 처리
“모든 검증 에러를 하나의 형태로 표준화한다.”
Express 에러 핸들링에서는 이런 “표준화”가 정말 중요하다.

---

# Q. let first = null;

이 한 줄은 사실 아주 전략적인 준비 동작이다.
단순히 “변수 선언”이 아니라,
뒤에 올 superstruct 오류 처리의 전체 구조를 떠받치고 있다.

**superstruct 에러는 “여러 개일 수도” 있다.**
superstruct는 규칙을 여러 개 검사하는데,
그 과정에서 실패가 1개일 수도 있고, 10개일 수도 있다.

예를 들어:

```json
{
  "email": "abc", // email 형식 잘못됨
  "password": 123, // password 타입 잘못됨
  "nickname": "" // nickname 빈 문자열
}
```

이렇게 3개 에러가 터질 수 있다.

근데 우리가 사용자한테 3개 다 한 번에 던지면?

```bash
email invalid
password incorrect
nickname empty
```

→ UX 최악…
→ 백엔드/프론트 연동하기 어려움
→ 실무에서는 보통 “첫 번째 에러만” 보여줌

즉, “여러 개 중 딱 하나만 뽑아와야 한다.”
그래서 변수 하나가 필요하다.

**superstruct 에러 객체 구조가 일정하지 않다**
이게 핵심! superstruct는 버전/구조에 따라 에러 구조가 다를 수 있다.

어떤 경우엔:

```js
error.failures(); // iterator
error.failures(); // 배열
error.path; // 존재함
```

정리하면:

failures() → iterator일 수도 있음
failures() → 배열일 수도 있음
구조가 아예 없을 수도 있음

그래서 어떤 상황이든 대비하기 위해 “first”라는 임시 변수를 마련하는 것이다.

**first는 “첫 번째 실패 정보”를 담는 그릇이다**
정확히 말하면, first는 다음을 담는 변수다.
어떤 필드가 잘못됐는지 → path
어떤 규칙이 어겨졌는지 → failure.type
superstruct가 기본으로 던지는 에러 메시지 → failure.message

즉, 사용자에게 보여줄 “대표 에러 정보”를 넣어두는 변수가 first이다.
그리고 이 변수는 “각 에러 구조를 모두 호환”하도록 처리하고 있다.

**왜 null로 초기화할까?**
초기값이 null인 이유는:

뒤에서 어떤 방식으로 첫 에러를 찾더라도
찾지 못하면 그대로 null 유지 → 안전
찾으면 first에 바로 할당

즉, “기본값 + 안전장치” 역할이다.

만약 not null로 시작하면:

타입 에러
undefined 접근 오류
message 접근 실패

같은 문제가 발생할 수 있다.

**비유**
superstruct 에러는 상자가 여러 개 들어 있는 큰 박스라고 생각하면,
근데 우리는 첫 번째 상자만 필요함.
그래서 first라는 빈 상자를 하나 준비해두고,
가장 앞에 있는 진짜 상자를 넣어주는 것이다.

---

# Q. if (typeof error?.failures === 'function')

_typeof 를 변환자로 쓰면 에러는 object 아니야? function이 왜 나와?_
error.failures는 **"error 객체 내부에 있는 함수"**다.
즉, error 자체는 object지만,
**그 안에는 여러 속성(property)들이 있고, 그중 하나가 함수(function)**일 수 있다.

그래서 위 코드가 의미하는 조건은,
“error.failures라는 프로퍼티가 함수 형태로 존재하니 호출 가능한지 확인해보자.”

error가 object라는 사실과 error.failures가 function일 수 있다는 건 전혀 충돌되지 않는다.

쉽게 비유하면:
이런 객체가 있다고 해보자:

```js
const room = {
  size: 30,
  openDoor() {
    console.log('문 열림');
  },
};
```

room은 object지만, room.openDoor는 function이다.

그래서:

```js
typeof room; // "object"
typeof room.openDoor; // "function"
```

둘 다 맞는 결과!
superstruct의 error도 이와 완전히 동일한 구조를 가진다.

**superstruct 에러 구조가 실제로 어떻게 생겼냐면**
superstruct에서 validate가 실패하면 Error 객체 하나가 반환되는데,

그 안에는 이런 속성들이 있다:

```js
{
  message: "...",
  path: [...],
  value: ...,
  failures: () => { ... }  // ← 이게 함수
}
```

즉, error 객체가 메서드(함수)를 가지는 형태다.

그래서, 위 코드는 superstruct 버전에서 failures API가 존재하는가?" 확인하는 용도다.

**왜 굳이 typeof === 'function' 체크를 할까?**
superstruct 버전이나 상황에 따라:
error.failures()가 존재할 때도 있고,
아예 존재하지 않을 때도 있고,
배열로 반환될 수도 있기 때문.
그래서 이렇게 안전하게 체크하는 것이다.

이건 **방어적 프로그래밍**이라고 부르고, 실무에서 매우 중요한 패턴이다.

---

# Q. const f = error.failures() ...

**f는 무엇인가?**

```js
const f = error.failures();
```

여기서 f는 superstruct가 제공하는 오류 목록이다.
문제는… f가 항상 같은 타입이 아니다.
f가 “iterator(반복자)”일 수도 있고,
f가 그냥 “배열”일 수도 있다
superstruct 버전, 환경, schema 종류에 따라 달라진다.
그래서 둘 다 대응해야 한다.

**Iterator(반복자)란?**
자바스크립트에서 이런 형태:

```js
const iter = {
  next() {
    return { value: something, done: false };
  },
};
```

즉, next() 메서드를 이용해 하나씩 값을 꺼내는 구조다.
그래서 f.next가 함수면 → “아 이건 iterator구나!” 라는 뜻.

**왜 iterator인지 확인해야 할까?**
superstruct의 failures() 는 대부분 iterator를 반환하지만,
일부 환경에서는 배열을 반환한다.

iterator 예시:

```js
const iter = error.failures();
iter.next().value; // 첫 번째 에러정보
```

배열 예시:

```js
const arr = error.failures();
arr[0]; // 첫 번째 에러정보
```

코드가 완전히 달라 “형식에 따라 처리 방식”을 나눈 것이다.

**코드 분석**

```js
if (typeof f.next === 'function') {
  first = f.next().value;
}
```

“만약 f.next가 함수라면 → f는 iterator이다.
그러므로 iterator 방식으로 첫 번째 에러를 꺼낸다.”

next() 호출
value로 첫 실패 정보를 얻음

```js
else if (Array.isArray(f)) {
  first = f[0];
}
```

iterator가 아니라면…
“f가 배열인지 확인하고, 배열이면 첫 번째 요소를 가져온다.”

---

# Q. resolveCustomMessage = (path, failure)

_failure 인자는 frist 이니깐 없어도 null 값이고 path는 없으면 null 로 던지니깐 둘다 null이면 어떻게 되는데?_
“둘 다 null이면 어떻게 되는데?”라는 질문의 핵심은,
resolveCustomMessage(), path, failure, 그리고 이후 로직이 어떻게 연결되는지를 이해하는 것이다.

이 코드에서:

```js
const message =
  resolveCustomMessage(path, first) ||
  first?.message ||
  '요청 데이터가 올바르지 않습니다';
```

여기서 핵심은:

path → "email" 같은 필드 이름
first → 실패 객체(첫 번째 validation error)
둘 다 없을 수도 있다.

**만약 path가 null이고 failure(first)도 null이면?**
그때 흐름은 이렇게 흘러간다:

1. resolveCustomMessage(path, first)
   path가 null이므로 함수는 바로:
   return null;

2. first?.message
   first가 null이므로 역시:
   undefined

3. 마지막 기본값
   따라서 최종 message는:
   "요청 데이터가 올바르지 않습니다"

즉, 둘 다 null이어도 전혀 문제 없다.
validate 미들웨어가 안전하게 기본 메시지를 반환하도록 설계됨.

**왜 path와 failure 둘 다 null일 수 있나?**
superstruct의 assert() 에러가 아주 특이하게 발생하는 경우:
failures()가 빈 iterator를 반환하거나
실패 객체 형식이 예상과 다르거나
schema 자체가 잘못된 경우
이때 path와 failure가 모두 존재하지 않는 상태가 가능하다.

그래서 validate 미들웨어는 fallback 메시지(기본 메시지)를 둬서,
항상 사람에게 보여줄 수 있는 문장을 보장한다.

# Q. 실무에서 더 필요한 경우

1. validation 대상 확장
   req.body 말고:
   req.params
   req.query
   req.file
   까지 검증할 필요가 생길 수 있다.
   유효성 검사러 예를 들어:
   이메일, 닉네임, 비번 등등 처리하는
   user-validator.js 그런 것이다.

2. i18n (다국어) 고려
   국제 서비스면 메시지를 메시지팩으로 분리할 수 있음:
   validation-messages.ko.js  
    validation-messages.en.js  
    ...
   근데 한국 서비스면 지금은 필요 없음.
