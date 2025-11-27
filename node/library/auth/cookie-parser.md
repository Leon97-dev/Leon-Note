# cookie-parser — Express 쿠키 파싱 미들웨어

_참고 사이트_
https://github.com/expressjs/cookie-parser

---

# 1. 개요

cookie-parser는 Express에서 쿠키를 읽고 파싱해주는 미들웨어다.
요청 헤더에 담긴 Cookie: 문자열을 자동으로 JS 객체로 변환해,
req.cookies 로 접근할 수 있게 만들어준다.

npm i cookie-parser ✅ 설치 필요

---

# 2. 주요 역할

- 브라우저가 보낸 쿠키를 자동 파싱
- 서명된 쿠키(signed cookie) 검증
- JWT Refresh Token 등을 httpOnly 쿠키에 저장할 때 필수
- Express 기반 로그인/세션 시스템 핵심 도구

프론트에서 쿠키를 보내면 서버가 그걸 바로 객체처럼 읽을 수 있다.

---

# 3. 기본 사용법

```js
import cookieParser from 'cookie-parser';

app.use(cookieParser());

// 이제 모든 요청에서
console.log(req.cookies);

// 예: 브라우저 쿠키
token = abcdef;
theme = dark;

// 서버에서는
req.cookies.token; // 'abcdef'
req.cookies.theme; // 'dark'
```

---

# 4. 서명된 쿠키(signed cookie)

쿠키를 위조방지 서명까지 붙여서 생성하고 싶을 때

```js
// 서버 설정
app.use(cookieParser(process.env.COOKIE_SECRET));

// 쿠키 생성
res.cookie('session', 'abc123', { signed: true });

// 읽기
req.signedCookies.session;
```

서명 검증 실패 시 자동으로 undefined가 된다.

---

# 5. JWT + 쿠키 조합 (실무 핵심)

Access Token은 보통 헤더에 담고,
Refresh Token은 httpOnly 쿠키에 저장하는 패턴이 많다.

```js
// 프론트가 보내는 쿠키
Cookie: refreshToken = abcdefg;

// 서버에서 읽기
const refresh = req.cookies.refreshToken;
```

- `httpOnly 쿠키 장점`
  \_ JS에서 접근 불가 → XSS 공격 방어
  \_ 자동으로 요청마다 전송됨
  \_ Refresh Token에 가장 적합

**cookie-parser가 없으면 이 쿠키 읽기가 자동으로 되지 않는다.**

---

# 6. Express에서 자주 쓰는 패턴

**< Refresh Token 재발급 >**

```js
router.post('/auth/refresh', (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: 'refresh token missing' });
  }

  // verify 후 Access Token 재발급
});
```

---

# 7. 쿠키 설정 옵션 (중요)

```js
res.cookie('refreshToken', token, {
  httpOnly: true,
  secure: true, // https 전용
  sameSite: 'strict', // CSRF 방지
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
});
```

- httpOnly: JS 접근 불가 (XSS 방어)
- secure: HTTPS에서만 쿠키 전송
- sameSite: 쿠키 크로스사이트 전송 제한 (CSRF 방지)
- maxAge: 쿠키 만료

실서비스에서는 거의 필수 옵션이다.

---

# 8. 쿠키 삭제

로그아웃 시 많이 사용된다.

```js
res.clearCookie('refreshToken');
```

---

# 9. cookie-parser 필요 여부

Node.js는 기본적으로 쿠키 파싱 기능이 없다.
따라서 Express에서 쿠키 기반 인증을 쓰려면 반드시 cookie-parser가 필요하다.

- Refresh Token을 쿠키에 저장하는 JWT 인증
- 세션 기반 로그인
- remember-me 기능
- 다중 로그인 제한
- 브라우저와 토큰 관리하는 서비스

**특히 이런 케이스에서는 cookie-parser가 사실상 필수로 들어간다.**
