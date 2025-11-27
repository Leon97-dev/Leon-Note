# Passport — 플러그인 기반 인증 프레임워크

_참고 사이트_
https://www.passportjs.org/

---

# 1. 개요

Passport는 Express에서 다양한 로그인 전략(Local, JWT, OAuth 등)을
플러그인처럼 붙여 사용할 수 있는 인증 프레임워크다.
“인증은 전략(strategy)이다. 필요한 전략을 추가해라.”
그래서 passport 본체는 작고, 전략(strategy) 패키지가 매우 많다.

npm i passport ✅ 설치 필요

---

# 2. 주요 역할

- 로그인 인증 전략 관리
- 세션 기반 인증 쉽게 구현
- JWT 인증 전략 추가 가능
- 소셜 로그인(OAuth) 구현
- 사용자 인증 흐름을 미들웨어화

특히 Express에서 로그인 기능을 구현할 때 패턴을 깔끔하게 유지하기 좋다.

---

# 3. Passport 작동 흐름 (핵심)

passport는 크게 3단계로 움직인다.

1. Strategy 설정
   예: LocalStrategy, JwtStrategy, GoogleStrategy 등
2. passport.authenticate() 사용
   요청에서 인증 처리 미들웨어 실행
3. 인증 성공 시 req.user에 사용자 정보 주입
   컨트롤러에서 req.user 접근 가능

---

# 4. LocalStrategy 예시 (ID/PW 로그인)

```js
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import prisma from '../prisma/index.js';

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) return done(null, false, { message: '사용자 없음' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return done(null, false, { message: '비밀번호 불일치' });

        return done(null, user); // 성공
      } catch (err) {
        return done(err);
      }
    }
  )
);
```

---

# 5. 로그인 라우터 (passport.authenticate)

```js
router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  (req, res) => {
    res.json({ user: req.user });
  }
);
```

session: false → 세션을 쓰지 않겠다는 의미 (JWT 조합 시 사용)

---

# 6. 세션 기반 인증(원하면)

Passport는 세션도 지원한다.

```js
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await prisma.user.findUnique({ where: { id } });
  done(null, user);
});
```

serialize → 로그인 성공 시 유저 ID만 세션에 저장
deserialize → 세션 ID로 사용자 데이터 로드

브라우저 웹사이트 로그인 시스템에서 많이 사용한다.

---

# 7. JWT 전략(JwtStrategy)

세션 대신 JWT 인증을 쓰고 싶을 때

```bash
npm i passport-jwt
```

```js
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });
      return user ? done(null, user) : done(null, false);
    }
  )
);

// 미들웨어
router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);
```

---

# 8. OAuth 전략 (Google, GitHub, Kakao 등)

passport의 진짜 힘은 OAuth 전략을 쉽게 붙이는 점이다.

```bash
npm i passport-google-oauth20
npm i passport-kakao
npm i passport-github2
```

전략 파일 분리도 가능해서 확장성 매우 뛰어나다.

```bash
auth/passport/
  localStrategy.js
  jwtStrategy.js
  googleStrategy.js
  kakaoStrategy.js
```

---

# 9. Passport가 좋은 이유

- 로직 분리: 전략 파일만 관리하면 됨
- Express 미들웨어와 자연스럽게 호환
- 세션/쿠키/JWT 모두 가능
- OAuth 전략이 매우 많음
- 구조를 통일할 수 있어 가독성↑ 유지보수↑

---

# 10. Passport 단점

- 사용법이 처음엔 다소 복잡함
- 전략이 분산되기 때문에 구조를 잘 잡아야 함
- JWT만 사용하는 간단한 API라면 passport 없이도 충분함

간단한 API 서버 → jwt.verify 직접 구현
로그인/소셜/세션 있는 서비스 → passport 활용 인기 많음
