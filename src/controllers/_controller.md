# 📁 Controllers 폴더 개념

## ✦ 의도

controllers 폴더는 **클라이언트 요청(Request)을 받아 서비스(Service)에게 전달**하고,
**응답(Response)을 만들어 반환**하는 계층이다.

즉, **HTTP 요청 입구**이며,
라우터(Router)와 서비스(Service)의 중간에서 “입출력 담당” 역할을 수행한다.

---

## ✦ 컨트롤러의 역할 (Controller Responsibility)

### ✔ 1) 요청 값(Request) 읽기

- req.params
- req.query
- req.body
- req.files

이와 같은 요청 데이터를 정리해서 서비스에 전달한다.

### ✔ 2) 요청 유효성 검사 (예: ValidationError)

부족한 값, 타입 오류, 잘못된 query 등
같은 문제는 서비스에 넘기기 전에 컨트롤러에서 차단하는 게 원칙이다.

### ✔ 3) 서비스(Service) 호출

컨트롤러는 직접 DB를 다루지 않는다.
비즈니스 로직은 모두 service 계층에서 담당하므로 컨트롤러는 다음만 한다:

```js
const data = await productService.getList(...)
```

### ✔ 4) 응답(Response) 생성

서비스에서 받은 결과를 JSON 형태로 가공해 반환한다.

### ✔ 5) 에러 전파 처리

컨트롤러 내부에서 throw한 에러는
async-handler → error-handler로 자동 전달된다.
컨트롤러는 응답 포맷을 직접 만들지 않는다.

---

## ✦ 컨트롤러가 해선 안 되는 것 (금지 영역)

### ✘ 1) DB 직접 접근

```js
await prisma.user.findMany(); // 컨트롤러에서 금지
```

### ✘ 2) 복잡한 비즈니스 로직

컨트롤러는 얇게, 서비스는 두껍게.

### ✘ 3) 환경 변수 사용

```js
process.env.DB_URL; // 금지
```

이런 값은 config에 있음.

### ✘ 4) 응답 포맷을 일관되지 않게 만들기

응답은 “서비스 결과만 JSON으로 감싸 전달”이 기본.

---

## ✦ 컨트롤러 예시 (개취에 따라 다름)

1. error 처리를 컨트롤러에서 같이 하는 경우

```js
import asyncHandler from '../core/error/async-handler.js';
import { productService } from '../services/product.service.js';
import { ValidationError } from '../core/error/error-handler.js';

export const getProductList = asyncHandler(async (req, res) => {
  const { order } = req.query;

  if (!order) {
    throw new ValidationError('order', '정렬 기준이 필요합니다.');
  }

  const products = await productService.getProductList(order);

  res.json({
    message: '상품 목록 조회 성공',
    results: products,
  });
});
```

2. Route Layer로 async-handler를 넘기는 경우

```js
import { productService } from '../services/product.service.js';
import { ValidationError } from '../core/error/error-handler.js';

export const getProductList = async (req, res) => {
  const { order } = req.query;
  ...
};

// routes/product.routes.js
router.post('/', asyncHandler(postProduct)) // 라우트 짬 처리
```

3. 응답 구조만 컨트롤러에 두고 싶은 경우 (내 방식)

```js
import { productService } from '../services/product.service.js';

export const getProductList = async (req, res) => {
  const { order } = req.query;
  const products = await productService.getProductOrThrow(order);

  res.json({
    success: true,
    message: '상품 목록 조회 성공',
    results: products,
  });
};

// services/product.service.js
export async function getProductOrThrow(id) {
  const productId = toIntOrThrow(id, 'id');
  const product = await findProductById(productId);

  if (!product) {
    throw new NotFoundError('상품을 찾을 수 없습니다');
  }

  return product;
} // 서비스 레이어가 비대해질 수 있으니 잘 고려해서 선택해야 한다

// routes/product.routes.js
router.post('/', asyncHandler(postProduct)); // 라우트 짬 처리
```

---

## ✦ 정리

컨트롤러는 프로젝트의 **입구(Entry Point)** 역할이다.
따라서 다음 속성을 지키는 것이 가장 중요하다:

- 얇게 유지 (Thin Controller)
- 비즈니스 로직은 서비스로 위임
- 입력 검증은 컨트롤러에서
- 에러는 async-handler를 통해 자동 전파
- 응답 포맷은 단순하고 일관되게

이렇게 구성하면 서비스 계층과 책임이 명확히 분리되고 코드 유지보수가 매우 쉬워진다.

---

## ✦ 핵심

폴더 구조는 회사마다, 팀마다, 그리고 개발자의 성향마다 모두 달라진다.
middlewares 외에도 configs, core, utils, validation 같은 계층 설계 방식은
프로젝트 규모와 성격에 따라 계속 변한다.

구조가 항상 정답처럼 고정되어 있으면 오히려 확장성과 창의성이 떨어질 수 있다.
정말 중요한 건 각 폴더의 의도와 흐름이 일관되게 유지되는 것이다.
