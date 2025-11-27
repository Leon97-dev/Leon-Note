# 📁 Routes 폴더 개념

## ✦ 의도

routes 폴더는 **URL(엔드포인트)을 실제 컨트롤러에 연결해주는 계층**이다.
즉, “어떤 URL이 어떤 동작을 수행할지”를 선언하는 API의 설계도 역할을 한다.

라우트는 DB도 모르고, 비즈니스 로직도 모르고, 응답 구조도 모른다.
오직 “URL → 미들웨어 → 컨트롤러” 흐름만 연결하는 것이 목적이다.

---

## ✦ 라우트 역할 (Routes Responsibility)

### ✔ 1) URL 매핑

```js
router.get('/articles/:id', asyncHandler(articleController.get));
router.post('/articles', requireAuth, asyncHandler(articleController.create));
```

“어떤 HTTP 요청이 어떤 기능을 실행하는가?”를 가장 위에서 결정한다.

### ✔ 2) 인증/인가 미들웨어 장착

라우트는 해당 API가 인증/권한이 필요한지 선언적으로 보여준다.
이 구조 덕분에 컨트롤러는 인증/인가 로직을 전혀 신경 쓰지 않아도 된다.

### ✔ 3) 유효성 검사(validator) 연결

각 요청이 올바른 형식을 갖추었는지 라우트에서 검사한다.
컨트롤러는 검증된 데이터만 처리하게 되어 안전하다.

### ✔ 4) 비동기 에러 처리 장착

Express 특성상 async/await 오류는 try/catch가 필요하다.
라우트에서 async-handler로 감싸면 컨트롤러는 깔끔한 상태를 유지한다.

---

## ✦ Route가 해선 안 되는 것 (금지 영역)

### ✘ 1) 비즈니스 로직

DB 접근 / 계산 / 조건 로직은 절대 라우트에 넣지 않는다.

### ✘ 2) 응답 생성

응답은 컨트롤러 역할이다.

### ✘ 3) 에러 처리

에러는 async-handler + error-handler가 담당한다.

### ✘ 4) 서비스 호출

서비스는 컨트롤러 내부에서 호출한다.

---

## ✦ Route 구조 패턴

### ✔ 1) 기능별 라우트 파일 분리 (권장)

```bash
routes/
 ├── user-routes.js
 ├── product-routes.js
 ├── article-routes.js
 └── article-comment-routes.js
```

코드 가독성과 유지보수성이 가장 좋다.

### ✔ 2) index.js 로 전체 라우터 묶기

```js
import userRoutes from './user-routes.js';
import productRoutes from './product-routes.js';

router.use('/users', userRoutes);
router.use('/products', productRoutes);
```

메인 app.js는 매우 깔끔해진다.

### ✔ 3) 라우트-컨트롤러-서비스 흐름 예시

```bash
Client → Routes → Middlewares → Controller → Service → Repository → DB
```

전체 API의 흐름을 가장 명확하게 보여주는 구성.

---

## ✦ 실전 예시

```js
// ArticleComment-Routes: URL 매핑
import express from 'express';
import asyncHandler from '../core/error/async-handler.js';
import validate from '../validator/validate.js';
import {
  CreateArticleComment,
  PatchArticleComment,
} from '../validator/article-comment-validator.js';
import { requireAuth } from '../middleware/auth.js';
import { articleCommentController } from '../controllers/article-comment-controller.js';

const router = express.Router();

router.get('/:articleId', asyncHandler(articleCommentController.list));

router.post(
  '/',
  requireAuth,
  validate(CreateArticleComment),
  asyncHandler(articleCommentController.create)
);

router.patch(
  '/:id',
  requireAuth,
  validate(PatchArticleComment),
  asyncHandler(articleCommentController.update)
);

router.delete(
  '/:id',
  requireAuth,
  asyncHandler(articleCommentController.remove)
);

export default router;
```

---

## ✦ 정리

Routes는 API의 구조를 선언하는 계층이다.

- 컨트롤러와 서비스의 역할을 침범하지 않고
- 인증/인가/검증을 붙이고
- 어떤 URL이 어떤 기능을 수행하는지 명확히 보여주는
- 프로젝트의 “API 설계도” 역할

프로젝트가 커질수록 라우트의 역할 분리와 구조화가 전체 유지보수성을 결정한다.

---

## ✦ 핵심

폴더 구조는 회사마다, 팀마다, 그리고 개발자의 성향마다 모두 달라진다.
middlewares 외에도 configs, core, utils, validation 같은 계층 설계 방식은
프로젝트 규모와 성격에 따라 계속 변한다.

구조가 항상 정답처럼 고정되어 있으면 오히려 확장성과 창의성이 떨어질 수 있다.
정말 중요한 건 각 폴더의 의도와 흐름이 일관되게 유지되는 것이다.
