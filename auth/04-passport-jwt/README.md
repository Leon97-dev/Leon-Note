# passport - jwt 기반 인증 프로젝트

# npm 패키지 설치 명령어

npm install express passport passport-jwt jsonwebtoken bcrypt dotenv

---

# passport란?

Passport는 Node.js의 인증(authentication) 미들웨어다.
Express 애플리케이션에 쉽게 통합할 수 있고, 복잡한 인증 과정을 단순화시켜주는 역할을 한다.
일종의 “인증 엔진 프레임워크”라고 보면 된다.
즉, 우리가 직접 “이메일 로그인은 이렇게 검증하고, 구글 로그인은 저렇게…" 이런 식으로 매번 로직을 짤 필요 없이,
Passport가 그 구조를 대신 관리해주는 것이다.

1️⃣ Passport의 철학 — 전략(Strategy)
Passport의 중심 개념은 Strategy(전략)이다.
이건 말 그대로 “어떤 방식으로 로그인할지”를 정하는 규칙 세트다.
예를 들어,

- passport-local: 이메일/비밀번호 로그인
- passport-jwt: JWT 토큰 로그인
- passport-google-oauth20: 구글 로그인
- passport-kakao: 카카오 로그인

이렇게 각 로그인 방식마다 전략을 따로 만들어서 붙이는 식이다.
이 덕분에 Passport는 하나의 미들웨어 구조로 모든 인증 방식을 통합할 수 있다.

2️⃣ Passport의 동작 원리
Passport는 Express와 함께 작동하면서 아래와 같은 흐름으로 인증을 처리한다.

1. 사용자 요청
   사용자가 /login 같은 경로로 이메일과 비밀번호를 보낸다.
2. Passport 전략 실행
   passport.authenticate('local') 또는 passport.authenticate('jwt')같은 미들웨어가 작동.
   이 미들웨어가 우리가 설정한 전략(strategy)에 따라 사용자 정보를 검증함.
3. 검증 결과 반환
   인증에 성공하면 done(null, user)를 호출해서 사용자 객체를 반환하고, 실패하면 done(null, false)로 종료
4. req.user 주입
   인증에 성공하면 Passport가 req.user라는 속성에 유저 객체를 자동으로 담아준다.
   이후 미들웨어나 컨트롤러에서는 req.user로 로그인한 유저 정보를 바로 확인 가능하다.

3️⃣ Passport의 두 가지 작동 모드

1. 세션 기반 (Session)
   passport.session()을 활성화하면 쿠키+세션 방식을 사용한다.
   로그인 성공 시, 서버 세션에 유저 ID를 저장하고 쿠키를 통해 인증을 유지한다.
   보통 SSR 웹사이트나 관리자 페이지 같은 전통적 서비스에서 많이 쓰인다.

2. 토큰 기반 (JWT)
   passport-jwt 전략을 이용하면, 서버 세션 없이도 인증 가능하다.
   로그인 성공 시 클라이언트에게 JWT 토큰을 발급하고,
   다음 요청부터는 Authorization: Bearer <token> 헤더로 인증을 수행한다.
   REST API, 모바일 앱, SPA 같은 환경에 적합하다.

4️⃣ serializeUser / deserializeUser
이건 세션 기반에서만 사용하는 개념이다.
JWT 기반에서는 쓰이지 않지만, 개념을 알아두는 게 좋다.

- serializeUser: 로그인 성공 시, 세션에 어떤 데이터를 저장할지 결정한다.
  → 예: done(null, user.id)
- deserializeUser: 세션에 저장된 user.id로 실제 유저 데이터를 복원한다.
  → 예: User.findById(id).then(user => done(null, user))

JWT 기반에서는 이 과정이 필요 없고, 토큰의 payload에서 바로 유저를 식별한다.

5️⃣ Passport의 장점

1. 인증 구조를 일관성 있게 관리할 수 있다.
   → 각 로그인 방식이 달라도 코드 구조는 동일하다.
2. 확장성이 좋다.
   → 새로운 로그인 방법이 추가되어도 전략(strategy)만 새로 등록하면 된다.
3. 인증과 비즈니스 로직을 분리할 수 있다.
   → 인증은 Passport가 담당하고, 이후 컨트롤러는 req.user만 다루면 된다.

---

# Passport-JWT vs 직접 JWT 인증의 차이

이전에 jsonwebtoken 라이브러리만으로 JWT 인증을 구현했을 때는,
로그인 시 토큰을 직접 발급하고, 이후 요청마다 직접 verify를 호출하는 방식이었다.

```js
// 직접 구현한 JWT 인증 미들웨어 예시
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const verifyToken = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: '토큰이 없습니다.' });

  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, env.jwt.accessSecret);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }
};
```

이건 간단하지만, 인증 방식이 늘어나면 코드 유지보수가 어려워진다.
이메일 로그인, 소셜 로그인, JWT 로그인 등 각각 verify 로직이 달라질 수 있기 때문이다.
그래서 Passport-JWT는 이 문제를 해결하는 방식으로 나온 것이다.

1️⃣ 인증 책임의 분리
직접 JWT를 쓸 때는 verifyToken 같은 미들웨어에서 직접 토큰을 검증해야 하지만,
Passport에서는 이 검증 로직을 Strategy 객체에 맡긴다.
즉, “토큰 검증을 누가 담당하느냐”의 차이다.

- 직접 방식 → 우리가 매번 검증 코드를 작성해야 함
- Passport-JWT → 전략(strategy)이 알아서 검증하고, 결과를 req.user에 넣어줌

이 덕분에, 라우트에서는 단 한 줄만 쓰면 된다.

```js
router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  meController
);
```

2️⃣ 미들웨어 체계의 통합
Passport는 인증 과정을 Express 미들웨어 체계 안으로 완전히 통합했다.
즉, passport.authenticate() 한 줄로 검증 → 실패 시 자동 401 응답 → 성공 시 req.user 주입.
직접 verify를 쓰면 try/catch, 응답처리, 유저조회 등 전부 우리가 써야 하지만,
Passport는 그걸 일관된 방식으로 처리해준다.
결국 코드 구조가 단순해지고, 여러 로그인 전략을 동시에 쓸 수 있게 된다.

3️⃣ Strategy 확장성
직접 JWT만 쓰면 “JWT 인증”만 가능한데, Passport는 “JWT 전략 외에도” 다른 전략을 병렬로 운영할 수 있다.

```js
passport.use('local', localStrategy);
passport.use('jwt', jwtStrategy);
passport.use('google', googleStrategy);
```

즉, 같은 앱에서 이메일 로그인, JWT 로그인, 소셜 로그인 모두 가능하다.
전략 이름('local', 'jwt', 'google')으로 구분해서 쓸 수 있다.

4️⃣ Express와의 통합성
Passport는 Express의 req, res, next 구조에 딱 맞게 설계되어 있어서,
라우트 미들웨어 체인 안에서 자연스럽게 동작한다.
직접 verify할 때보다 흐름 제어가 훨씬 깔끔해지고, 미들웨어 레벨에서 인증 실패를 자동으로 걸러줄 수 있다.

5️⃣ 유지보수성
직접 JWT 검증 코드는 단순하지만,
인증 로직이 여러 곳에서 중복되기 쉽고 나중에 인증 정책이 바뀌면 모든 검증 미들웨어를 수정하는 번거로움이 있다.
Passport는 전략을 하나만 수정하면 전체 인증 구조가 바뀌니까 유지보수가 훨씬 쉽다.

---

# Passport 흐름 구조

routes/auth.routes.js → controllers/auth.controller.js → utils/jwt.js → (토큰 발급)
↓
routes/user.routes.js → middlewares/auth.js → passport/strategies/jwt.js →
services/userRepo.js → req.user

[요약]
Passport는 JWT 발급/재발급은 관여하지 않고, 검증(인증) 미들웨어 표준화만 맡는다. (토큰 발급/리프레시는 컨트롤러에서 계속 직접 처리)

router → controller → service(repo) → DB + requireAuth(passport.authenticate('jwt'))로 보호 라우트 인증.

app.js는 미들웨어/라우트 조립이고, server.js는 포트 열어 실행(실행 책임 분리).

config/env.js는 .env를 단일 진실원(Single Source of Truth) 으로 정리해 전역에서 안전하게 사용.

---

# CURD 코드 분해 과정

예시

```js
router.get(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).send({ message: '정수가 아닌 id입니다.' });
    }

    const product = await prisma.product.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        stock: true,
        imagePath: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    res.send(product);
  })
);
```

분해
📁 routes/product.routes.js

```js
import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { getProductById } from '../controllers/product.controller.js';

const router = Router();

router.get('/:id', requireAuth, asyncHandler(getProductById));

export default router;
```

📁 controllers/product.controller.js

```js
import { productRepo } from '../services/productRepo.js';

export const getProductById = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: '정수가 아닌 id입니다.' });
  }

  const product = await productRepo.findById(id);
  res.json(product);
};
```

📁 services/productRepo.js

```js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const productRepo = {
  findById: (id) => prisma.product.findUniqueOrThrow({ where: { id } }),
};
```
