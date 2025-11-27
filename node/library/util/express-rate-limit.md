# express-rate-limit — 요청 폭주 방지 미들웨어

_참고 사이트_
https://github.com/express-rate-limit/express-rate-limit

---

# 1. 개요

express-rate-limit은 Express 서버에서,
특정 IP의 요청 횟수를 제한(rate limiting) 하여,
과도한 트래픽·봇 공격·브루트포스 로그인 시도 등을 차단하는 미들웨어다.
트래픽 보호 + 보안 강화 = 운영 환경에서 매우 유용하다.

npm i express-rate-limit ✅ 설치 필요

---

# 2. 주요 역할

Express 서버의 보안 기본 설정을 한 번에 적용해준다.

- 특정 시간(window) 동안 허용 가능한 요청 수 제한
- 요청 초과 시 자동으로 429 상태코드(Too Many Requests) 반환
- 로그인/회원가입/OTP 같은 보안 민감 API 보호
- 공개 API 남용 방지
- 봇, 스팸, 크롤러 트래픽 차단

---

# 3. 기본 사용법

```js
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1분
  max: 30, // 1분당 30회
});

app.use(limiter);
```

전체 API에 대해 1분당 30번 제한하는 함수다.

---

# 4. 특정 라우트만 제한하기

**< 로그인 시도 제한 (가장 많이 쓰는 패턴) >**

```js
const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5, // 1분에 로그인 5번만
  message: '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.',
});

router.post('/login', loginLimiter, controller.login);
```

---

# 5. 주요 옵션

```js
windowMs; // 시간 범위 (ms)
max; // 허용 요청 수
message; // 초과 시 보낼 응답 메시지
statusCode; // 기본: 429
standardHeaders; // true로 하면 표준 rate-limit 헤더 추가
legacyHeaders; // old-style 헤더 제거 여부
```

```js
// 예시)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100,
  standardHeaders: true,
});
```

---

# 6. 동작 방식

Rate-limit이 활성화되면 서버가 관리하는 "버킷" 구조로 각 IP의 요청 횟수를 카운트한다.

- 초과 → 429 반환
- 남은 요청 수는 헤더로 보내짐 (옵션 활성화 시)

이로 인해 서버는 API flooding, brute-force, 자동화 공격을 방어할 수 있다.

---

# 7. 실무에서 자주 쓰는 시나리오

- 로그인/회원가입 시도 제한
- 비밀번호 재설정, 인증코드 요청 제한
- 공개 API 호출 남용 방지
- 웹훅(URL 노출된 엔드포인트) 보호
- 크롤링 차단

운영 환경(API 서비스)에서는 매우 높은 확률로 도입된다.

---

# 8. 실무 팁

- Rate-limit은 너무 엄격하면 정상 사용자가 차단됨
- 로그인/회원가입 같은 민감 라우트만 제한하는 것이 현실적
- Nginx/Cloudflare 등의 레벨에서 rate-limit을 걸면 ‘서버 이전’ 단계에서 차단 가능
- 분산 서버 환경에서는 Redis store 사용 가능 (별도 설정 필요)
