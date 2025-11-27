# UUID — 고유 식별자 생성 라이브러리

_참고 사이트_
https://github.com/uuidjs/uuid

---

# 1. 개요

uuid는 범용 고유 식별자(Universally Unique ID) 를 생성하는 라이브러리다.
중복될 확률이 사실상 0에 가까운 ID 값을 만들어야 할 때 사용된다.

npm i uuid ✅ 설치 필요

---

# 2. 주요 역할

특히 JWT, Prisma, Redis, 업로드 파일 등에서 광범위하게 쓰인다.

- 고유한 ID 생성
- 데이터베이스 PK 대체 가능
- 업로드 파일명 생성
- 토큰/세션/임시 키 생성
- 분산 시스템에서 ID 충돌 없이 생성

---

# 3. 버전 종류

uuid는 v1 ~ v4 여러 버전이 있다.
실무에서 가장 많이 쓰는 랜덤 기반 UUID v4만 써도 충분하다.

---

# 4. 기본 사용법

```js
import { v4 as uuidv4 } from 'uuid';

const id = uuidv4();
console.log(id);
```

---

# 5. 활용 예시

**< DB 레코드의 id 생성 >**

```js
const user = await prisma.user.create({
  data: {
    id: uuidv4(),
    name: 'Leon',
  },
});
```

**< 업로드 파일명 유니크하게 만들기 >**

```js
const fileName = uuidv4() + '.png';
```

**< 짧은 링크(단축 URL) 고유 키 생성 >**

```js
const shortKey = uuidv4().slice(0, 8);
```

**< Redis 캐시 키 >**

```js
await redis.set(`session:${uuidv4()}`, JSON.stringify(data));
```

---

# 6. UUID vs autoincrement 비교

- `UUID`
  \_ 충돌 가능성: 사실상 없음
  \_ 정렬성: 랜덤이라 정렬 불가
  \_ 분산 환경: 매우 유리
  \_ 길이: 긴 문자열
  \_ 사용성: 프론트·백 모두 공유 가능

- `Auto-increment`
  \_ 충돌 가능성: 테이블 단위
  \_ 정렬성: 순차 증가
  \_ 분산 환경: 충돌 위험
  \_ 길이: 숫자
  \_ 사용성: DB 내부용

**대규모 시스템에서는 UUID를 선호하는 경우가 많다.**
