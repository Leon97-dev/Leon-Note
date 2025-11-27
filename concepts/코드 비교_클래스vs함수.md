# 함수 기반 컨트롤러 vs 클래스 기반 컨트롤러

# 1. Express의 기본 철학

Express는 원래 미들웨어 함수들의 연속(Chain of Functions) 으로 설계되었다.

route → controller(함수) → service(함수) → db(함수)

이 흐름 자체가 “함수 중심”으로 맞춰져 있다.
그래서 Express에서 클래스를 쓰면 기본 흐름과 맞지 않아 오히려 불필요한 껍데기가 생기는 경우가 많다.

--

# 2. 함수 기반 컨트롤러

컨트롤러를 그냥 함수로 만들어서 내보내는 방식.

```js
export const getUser = async (req, res) => { ... }
export const updateUser = async (req, res) => { ... }
```

Express가 기대하는 구조에 100% 자연스럽게 맞고, Prisma도 함수 기반 비동기 호출에 완벽히 어울린다.
현업에서 가장 흔한 구조다.

_장점_

- 짧고 단순함
- 파일 간 이동이 쉽고 구조 가벼움
- Prisma 호출이 자연스럽게 연결됨
- 테스트 작성 쉬움 (그냥 함수 호출)
- 가독성이 가장 좋음

_왜 실무에서 많이 쓰일까?_

Express + Prisma 조합은 대규모 팀보다 소규모~중규모 팀에서 훨씬 더 많다.
이 상황에서 클래스 패턴은 필요 없는 “구조적 부담”만 준다.

---

# 3. 클래스 기반 컨트롤러

컨트롤러를 class로 묶고 그 안에 메서드로 API를 정의하는 방식.

```js
class UserController {
  async getUser(req, res) { ... }
  async updateUser(req, res) { ... }
}
```

이 패턴은 NestJS, Java Spring 스타일, DI 패턴을 흉내내는 구조다.
Express 단일 프로젝트에서는 보통 다음 이유로 잘 안 쓴다.

- 라우터에서 controller.getUser.bind(controller) 같은 바인딩 필요
- express 미들웨어 흐름과 잘 안 맞음
- 파일이 많아지고 복잡도가 증가함
- 초기 셋업과 문서화가 더 필요함

_언제 유용해질까?_

Express 프로젝트라도 아래 상황에서는 의미가 생긴다.

- 팀 규모가 크고 코드 규칙을 강하게 통제해야 할 때
- 각 컨트롤러가 “상태”를 가져야 할 때
- 의존성 주입(DI)을 써야 할 때
- 하나의 DB가 아니라 여러 DB 혹은 여러 서비스 인스턴스를 다룰 때
- NestJS 스타일을 적극적으로 흉내낼 때

하지만 Prisma 기반의 CRUD API에서는 거의 필요 없다.

---

# 4. 기준으로도 함수 방식이 더 침착하게 맞는다

```js
await prisma.user.findMany();
await prisma.product.update();
await prisma.order.create();
```

**Prisma는 OOP 기반 ORM이 아니라 “함수형 DB 클라이언트”이다.**
그래서 컨트롤러도 함수로 가는 게 전체 흐름이 깔끔하게 이어진다.
클래스로 가면 “필요 없는 계층”만 생긴다.

- service class
- controller class
- DB client 주입
- 인스턴스 생성

이게 Express에서는 과설계가 된다.
