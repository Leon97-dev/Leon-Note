# Node.js 웹 애플리케이션 프레임워크 — Express

_참고 사이트_
https://expressjs.com/

---

# 1. 개요

Express는 Node.js에서 가장 널리 쓰이는 웹 서버 프레임워크다.
라우팅, 미들웨어, 요청/응답 처리 등을 단순한 API로 제공해 API 서버를 빠르게 만들 수 있다.

npm i express ✅ 설치 필요

---

# 2. 주요 역할

- 라우팅(GET, POST, PUT, DELETE 등)
- 미들웨어 기반 요청 처리
- JSON 파싱, 정적 파일 제공
- 에러 핸들링 구조 제공
- 서버 listen(포트 열기)

Express는 최소한의 기능만 제공해서 가볍다.
필요하면 미들웨어 조합으로 기능을 확장한다.

---

# 3. 핵심 메서드 / 개념 정리

**< express() — 앱 생성 >**

```js
import express from 'express';
const app = express();
```

**< app.use(middleware) — 미들웨어 등록 >**
모든 요청에 대해 공통적으로 실행할 작업 등록

```js
app.use(express.json()); // JSON 파싱
app.use(cors()); // CORS 허용
app.use(morgan('dev')); // 로그 출력
```

요청(req), 응답(res), next 함수를 기반으로 동작한다.

**< 라우팅 — app.get(), app.post() 등 >**

```js
app.get('/products', (req, res) => {
  res.json({ message: '상품 목록' });
});
```

사용 가능한 메서드: GET, POST, PUT, PATCH, DELETE, OPTIONS 등

**< app.listen(port) — 서버 실행 >**

```js
app.listen(3000, () => {
  console.log('Server running on 3000');
});
```

**< Router() > — 라우트 분리 >**
실무에서 가장 중요한 개념 중 하나다.
엔드포인트를 모듈로 분리해 유지보수를 쉽게 만든다.

```js
import { Router } from 'express';
const router = Router();

router.get('/', controller.list);
router.post('/', controller.create);

export default router;

// 메인 app.js에 연결
app.use('/products', productRouter);
```

---

# 4. 미들웨어 설명 (Express의 핵심)

Express는 미들웨어 구조로 이루어져 있다.

```js
function (req, res, next) {
  // 작업 수행
  next(); // 다음 미들웨어로 이동
}
```

- Application-level middleware — app.use()
- Router-level middleware — router.use()
- Error-handling middleware — (err, req, res, next)

---

# 5. 에러 핸들러

Express는 에러 핸들러를 따로 가져야 한다.

```js
function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ message: '서버 에러' });
}
```

등록 순서 중요!

```js
app.use(errorHandler); // 라우터 아래쪽에 위치
```

---

# 6. 정적 파일 제공

사용 예: 이미지, CSS, JS 파일 서빙

```js
app.use('/static', express.static('public'));
```

---

# 7. 라우터와 컨트롤러 분리 — 실무 패턴

실무에서 가장 많이 쓰는 Express 구조

```css
src/
 ├─ app.js
 ├─ routes/
 │   └─ product-route.js
 ├─ controllers/
 │   └─ product-controller.js
 └─ middlewares/
```

```js
// app.js
app.use('/products', ProductRouter);
app.use(errorHandler);

// product-route.js
router.post('/', productController.create);
router.get('/', productController.list);

// product-controller.js
export const productController = {
  async list(req, res) {
    const results = await prisma.product.findMany();
    res.json({ results });
  },
};
```

Express는 이 구조를 기반으로 API 서버를 만든다.

---

# 8. 자주 하는 실수

- app.listen을 app.js에 두고 테스트가 어려워짐 → server.js 따로 두는 게 좋음
- errorHandler 위치를 라우터 위에 둬서 동작 안 함
- express.json()을 안 써서 req.body가 undefined
- Router() 안 쓰고 모든 라우트를 app.js에 몰아 넣음
- async 함수에서 try-catch 누락 → 전역 에러 핸들러 필요
