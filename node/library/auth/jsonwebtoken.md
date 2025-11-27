# jsonwebtoken — JWT 토큰 생성·검증 라이브러리

_참고 사이트_
https://github.com/auth0/node-jsonwebtoken

---

# 1. 개요

jsonwebtoken은 JWT(JSON Web Token) 생성·검증을 담당하는 라이브러리다.
로그인 후 사용자 인증 상태를 유지하는 데 가장 널리 쓰이며,
세션을 쓰지 않는 토큰 기반 인증 방식의 핵심 도구다.

npm i jsonwebtoken ✅ 설치 필요

---

# 2. JWT란?

서버가 사용자에게 발급하는 서명된 문자열 토큰이다.

**< 구성 >**

```css
header.payload.signature
```

- header: 알고리즘/타입 정보
- payload: 사용자 정보(유저ID, role 등)
- signature: 위조 방지용 서명

JWT는 서버가 서명하기 때문에 누군가 토큰 내용을 바꿔도 signature가 깨져서 검증에 실패한다.

---

# 3. 주요 역할

- 로그인 시 JWT 발급
- 요청마다 Authorization 헤더로 인증
- payload에 로그인 정보 포함
- 토큰 유효기간 관리(expiresIn)
- 서버 확장(분산 환경)과 궁합이 좋음

---

# 4. JWT 생성 (sign)

```js
import jwt from 'jsonwebtoken';

const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
  expiresIn: '1h',
});
```

- userId: payload (필요한 정보만 담기)
- JWT_SECRET: 절대 공개되면 안 되는 서명 비밀키
- expiresIn: 토큰 만료 시간

---

# 5. JWT 검증 (verify)

```js
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded);
} catch (err) {
  console.log('토큰 검증 실패', err);
}
```

검증 실패 경우: 위조된 토큰, 만료된 토큰, 잘못된 서명키

---

# 6. Express 미들웨어 예시

```js
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: '인증 필요' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: '유효하지 않은 토큰' });
  }
}
```

---

# 7. Refresh Token과 Access Token

실무에서는 보통 두 가지 토큰을 함께 사용한다:

- `Access Token`
  \_ 짧은 수명 (15분~1시간)
  \_ 빠른 인증용

- `Refresh Token`
  \_ 긴 수명 (1주~1개월)
  \_ Access Token 재발급용
  \_ 보통 httpOnly 쿠키에 저장

이 조합이 보안과 편의성의 균형을 맞춘다.

---

# 8. JWT가 가진 장점

- 서버에 세션 저장 필요 없음 (stateless)
- 확장 서버(멀티 서버)에서 사용 쉬움
- 프론트/앱/백엔드를 동시에 커버
- HTTP 헤더만으로 인증 처리 가능

---

# 9. JWT가 가진 단점

- 토큰이 탈취되면 만료 전까지 막기 어려움
- payload가 암호화가 아니라 "base64 인코딩"임
  → 보안 정보(PW 등) 저장 금지
- 만료/블랙리스트 관리 필요

**그래서 민감 정보는 절대 payload에 넣으면 안 된다.**

---

# 10. Prisma와 조합 예시

```js
// 로그인 성공 시
const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
  expiresIn: '1h',
});

return res.json({ token });

// 인증 미들웨어로 userId 읽기
req.user.userId; // 이걸 DB 쿼리에 그대로 활용하면 된다.
```
