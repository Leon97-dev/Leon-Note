# 📁 Services 폴더 개념

## ✦ 의도

services 폴더는 **비즈니스 로직의 중심 계층**이다.
컨트롤러가 받은 요청 데이터를 검증하고,
Repository를 호출하여 필요한 데이터를 가져오고,
요구사항에 맞는 로직을 수행한 뒤 결과를 반환한다.

서비스는 “앱의 핵심 규칙과 시나리오”를 담당하는 계층이다.
즉, 프로젝트가 제공하는 기능의 진짜 본심이 담기는 곳.

---

## ✦ 서비스 역할 (Services Responsibility)

### ✔ 1) 비즈니스 로직 처리 (핵심)

컨트롤러가 아닌 “서비스”가 기능의 본질적 행동을 담당한다.

- 회원가입 시 중복 검사
- 로그인 시 비밀번호 비교
- 상품 등록 시 재고 조건 검사
- 댓글 수정 시 작성자 본인 여부 체크

기타 등등 비즈니스 규칙이 모이는 계층이기 때문에 가장 두꺼워지는 곳이다.

### ✔ 2) Repository 호출

서비스는 Repository와 직접 대화하는 유일한 계층이다.

```js
const user = await userRepo.findUserByEmail(email);
```

서비스는:

- 어떤 데이터를 원한다 → Repository에게 요청
- DB 구조나 Prisma 쿼리는 관심 없음

### ✔ 3) 예외 처리 (유효하지 않은 데이터 감지)

서비스는 요구사항을 위반하는 상황을 감지하고 에러를 던진다.

```js
if (!user) throw new NotFoundError('유저를 찾을 수 없습니다');
if (user.id !== req.user.id) throw new UnauthorizedError();
```

컨트롤러는 에러를 직접 만들지 않는다.
서비스에서 에러를 던지고 async-handler → error-handler에서 처리한다.

### ✔ 4) 데이터 후처리

Repository는 “원본 DB 데이터”를 제공하므로
서비스는 이를 가공하거나 정리해서 컨트롤러에 반환한다.

- 비밀번호 숨기기
- refreshToken 제거
- createdAt 변환 등등

---

## ✦ Service가 해선 안 되는 것 (금지 영역)

### ✘ 1) HTTP 응답(res.json)

서비스는 Express를 모른다.

### ✘ 2) 요청(req) 객체 직접 사용

Parameter만 받을 뿐 req 자체는 사용하지 않는다.

### ✘ 3) DB 쿼리 직접 실행

Prisma 호출은 무조건 repository에서만.

### ✘ 4) 라우터나 인증 미들웨어의 책임 침범

서비스는 오직 “비즈니스 로직”만 담당.

---

## ✦ Service 구성 패턴

### ✔ 1) 함수 기반 (간단한 API)

```js
export async function getUser(id) { ... }
```

### ✔ 2) 묶음 객체 기반 (추천)

```js
export const userService = {
  register(data) {},
  login(data) {},
};
```

가독성, 자동완성, 규모 확대 모두 적절함.

### ✔ 3) 클래스 기반 (대형 프로젝트)

DI(의존성 주입) 환경에서 효과적.

---

## ✦ Typical 흐름 예시

```bash
Client → Routes → Middlewares → Controller → Service → Repository → DB
```

---

## ✦ 실전 예시

```js
// User-Service: 비즈니스 로직
import { userRepo } from '../repositories/user-repository.js';
import { hashPassword, verifyPassword } from '../utils/to-hash.js';
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../core/error/error-handler.js';

export const userService = {
  async registerUser({ email, password, nickname }) {
    const exists = await userRepo.findUserByEmail(email);
    if (exists) throw new ConflictError('이미 존재하는 이메일입니다.');

    const hashed = await hashPassword(password);
    return userRepo.createUser({ email, password: hashed, nickname });
  },

  async loginUser(email, password) {
    const user = await userRepo.findUserByEmail(email);
    if (!user) throw new UnauthorizedError('로그인 정보가 유효하지 않습니다');

    const ok = await verifyPassword(password, user.password);
    if (!ok) throw new UnauthorizedError('로그인 정보가 유효하지 않습니다');

    return user;
  },
};
```

---

## ✦ 정리

Service는 전체 프로젝트의 두뇌(Brain) 이다.

- 컨트롤러는 입출력 담당
- Repository는 DB 담당
- Service는 로직 담당

이 3계층 구조가 지켜져야 유지보수가 쉽고, 역할이 명확하며, 프로젝트가 커져도 무너지지 않는다.
Service 계층이 단단할수록 전체 서비스는 안정적이고 확장 가능해진다.

---

## ✦ 핵심

폴더 구조는 회사마다, 팀마다, 그리고 개발자의 성향마다 모두 달라진다.
middlewares 외에도 configs, core, utils, validation 같은 계층 설계 방식은
프로젝트 규모와 성격에 따라 계속 변한다.

구조가 항상 정답처럼 고정되어 있으면 오히려 확장성과 창의성이 떨어질 수 있다.
정말 중요한 건 각 폴더의 의도와 흐름이 일관되게 유지되는 것이다.
