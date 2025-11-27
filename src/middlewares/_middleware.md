# 📁 Middlewares 폴더 개념

## ✦ 의도

middlewares 폴더는 HTTP 요청(Request)과 컨트롤러(Controller) 사이에서,
요청을 검사, 가공, 제어하는 계층이다.

즉, **요청 전처리 영역(Pre-processing Layer)** 역할을 하며,
“공통 기능을 재사용 가능한 형태로 모아두는 곳”이다.

---

## ✦ 미들웨어의 역할 (Middleware Responsibility)

### ✔ 1) 요청(Request) 사전 검증

- 로그인 여부 검사 (requireAuth)
- 관리자 권한 검사
- 요청 본문 검증(validate middleware)
- API 호출 속도 제한(rate-limit)
- IP/도메인 차단

서비스(Service)까지 요청이 가지 않도록 중간에 차단하는 기능들이다.

### ✔ 2) 요청(Request) 데이터 가공

- 파일 업로드(multer)
- 이미지 리사이즈(sharp)
- JSON 파싱
- 쿠키/세션 로드
- 헤더 파싱

컨트롤러가 쓸 수 있는 형태로 “준비된 데이터”를 만들어준다.

### ✔ 3) 인증/인가 처리

- JWT 토큰 해석하기
- 쿠기에서 세션 ID 복구
- 유저 정보 req.user에 할당

컨트롤러는 req.user만 읽으면 된다.

### ✔ 4) 공통 로깅

- 요청 시간/메소드/경로 로그 출력
- 에러 전처리
- 개발 모드에서 디버깅 로그 출력

컨트롤러를 깔끔하게 유지한다.

---

## ✦ 미들웨어가 해선 안 되는 것 (금지 영역)

### ✘ 1) DB 직접 접근

```js
await prisma.user.findMany(); // 금지
```

### ✘ 2) 비즈니스 로직

서비스(Service)에서 처리해야 할 책임이다.

### ✘ 3) 응답을 마음대로 변형

응답 포맷은 컨트롤러에서 결정한다.

### ✘ 4) 라우트 역할까지 하는 경우

미들웨어는 라우트를 대체하지 않는다.

---

## ✦ 미들웨어 종류 예시 (실무 기준)

### ✔ 인증계 (auth)

- requireAuth
- optionalAuth
- requireAdmin

→ 로그인/권한 흐름 제어

### ✔ 보안계 (security)

- helmet
- cors
- rateLimit
- xss-clean
- hpp

→ API 보호용

### ✔ 검증계 (validation)

- validate(CreateUserSchema)
- validate(LoginSchema)
- validate(ProductSchema)

→ 서비스로 가기 전에 잘못된 요청을 차단

### ✔ 파일 처리계 (file)

- multer
- imageUpload
- imageResize

→ 파일 업로드/압축/검증

### ✔ 로깅/디버깅계 (logging)

- 요청 로거(morgan or custom logger)
- debug middleware

→ 요청 분석 및 기록

### ✔ 상태/트래픽 제어계

- maintenanceMode
- throttle
- apiVersionCheck

→ 서비스 안정성 유지

---

## 폴더 트리 구조

```bash
middlewares/
  ├── auth/
  │     ├── require-auth.js
  │     ├── optional-auth.js
  │     └── require-admin.js
  │
  ├── validation/
  │     └── validate.js
  │
  ├── file/
  │     ├── upload.js
  │     └── resize.js
  │
  ├── logging/
  │     ├── request-logger.js
  │     └── debug.js
  │
  ├── security/
  │     ├── cors.js
  │     ├── helmet.js
  │     └── rate-limit.js
  │
  └── index.js
```

---

## ✦ 정리

middlewares는 프로젝트의 **요청 전처리 관문(checkpoint)**이다.
따라서 다음 원칙을 지키면 구조가 깔끔해진다:

- 같은 계열끼리 묶기 (auth / validation / file / logging / security)
- 비즈니스 로직, DB 접근 금지
- 컨트롤러로 들어가기 전에 모든 검증을 끝내기
- 재사용 가능한 작은 유닛으로 만들기
- 에러는 error-handler로 전파되도록 설계

---

## ✦ 핵심

폴더 구조는 회사마다, 팀마다, 그리고 개발자의 성향마다 모두 달라진다.
middlewares 외에도 configs, core, utils, validation 같은 계층 설계 방식은
프로젝트 규모와 성격에 따라 계속 변한다.

구조가 항상 정답처럼 고정되어 있으면 오히려 확장성과 창의성이 떨어질 수 있다.
정말 중요한 건 각 폴더의 의도와 흐름이 일관되게 유지되는 것이다.
