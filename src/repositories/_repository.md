# 📁 Middlewares 폴더 개념

## ✦ 의도

repositories 폴더는 **DB 접근을 전담하는 계층**이다.
서비스(Service)에서 필요한 데이터를 요청하면,
여기서 **Prisma(또는 ORM/쿼리)를 직접 실행**해 결과를 반환한다.

즉, 데이터베이스와 통신하는 **DAO(Data Access Object)** 레이어다.

서비스와 DB를 분리해
코드 구조를 더 안전하게 만들고 유지보수성을 높이는 것이 목적이다.

---

## ✦ 저장소 역할 (Repository Responsibility)

### ✔ 1) DB 쿼리 실행 (Read / Write 포함)

- findMany()
- findUnique()
- create()
- update()
- delete()

데이터를 불러오거나 수정하는 모든 작업은 Repository에서 이루어진다.

### ✔ 2) select, include, orderBy 같은 스키마 구조를 감춤

```js
// Service → 단순하게 호출
const user = await userRepo.findUserByEmail(email);

// Repository → Prisma 내부 구조는 여기서만 관리
return prisma.user.findUnique({ where: { email } });
```

서비스는 “무슨 데이터를 원하냐”만 말하면 되고,
**“어떻게 가져오냐”**는 Repository가 담당한다.

### ✔ 3) 데이터 접근 로직 중앙화

여러 서비스에서 같은 쿼리를 쓴다면?

controller → service → repository 구조에서,
쿼리는 repository에만 존재하므로 중복이 없다.

---

## ✦ 저장소가 해선 안 되는 것 (금지 영역)

### ✘ 1) 비즈니스 로직

```js
// 금지 ❌
if (!user) throw new NotFoundError();
if (user.role !== 'admin') throw new ForbiddenError();
```

권한 검사, 검증(validation), 예외 처리는 Service에서 해야 한다.

### ✘ 2) 응답(HTTP Response) 만들기

- status code
- JSON 응답
- 메시지

이것은 Controller 역할이다.

### ✘ 3) 데이터 정제/포맷팅

Repository는 “DB에서 가져온 원본 값”만 전달한다.
후처리는 Service가 담당한다.

---

## ✦ Repository 구조 패턴

### ✔ 1) 함수 기반 (가장 단순)

```js
export function findUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}
```

### ✔ 2) 묶음 오브젝트 기반 (추천)

```js
export const userRepo = {
  findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  },
  create(data) {
    return prisma.user.create({ data });
  },
  update(id, data) {
    return prisma.user.update({ where: { id }, data });
  },
};
```

가독성 + 확장성 + 자동 완성 면에서 가장 적절한 구조.

### ✔ 3) 클래스 기반 (규모가 커질 때 사용)

```js
class UserRepository {
  findById(id) {}
  create(data) {}
}
export const userRepo = new UserRepository();
```

대형 서비스 또는 의존성 주입(DI) 환경에서 유리하다.

---

## Repositories 계층을 반드시 분리해야 하는 이유

### ✔ 서비스 레이어가 깔끔해진다

비즈니스 로직만 집중할 수 있다.

### ✔ DB 교체가 쉬워진다

Prisma → TypeORM → raw SQL로 바뀌어도 Repository 안에서만 수리하면 된다.

### ✔ 테스트가 쉬워진다

Mock Repository를 주입해 서비스 단위 테스트가 가능하다.

### ✔ 응집도 증가 + 결합도 감소

서비스 ↔ DB 직접 결합을 끊어 구조가 단단해진다.

---

## ✦ Repository 예시

```js
// Article-Comment-Repository: DB 저장소
import prisma from '../config/prisma.js';

export const articleCommentRepo = {
  findByArticle(articleId) {
    return prisma.articleComment.findMany({
      where: { articleId },
      orderBy: { createdAt: 'asc' },
    });
  },

  findById(id) {
    return prisma.articleComment.findUnique({
      where: { id },
    });
  },

  create(data) {
    return prisma.articleComment.create({ data });
  },

  update(id, data) {
    return prisma.articleComment.update({ where: { id }, data });
  },

  remove(id) {
    return prisma.articleComment.delete({ where: { id } });
  },
};
```

---

## ✦ 정리

Repository는 서비스 코드와 DB 코드를 분리해,
더 깨끗하고 유지보수하기 좋은 구조를 만든다.

- 서비스는 무엇을 원하는지 말하고
- 리포지토리는 어떻게 가져오는지 처리한다
- 컨트롤러는 그 결과를 HTTP로 반환한다
- 세 계층의 역할이 명확하면 규모가 커져도 흔들리지 않는다

---

## ✦ 핵심

폴더 구조는 회사마다, 팀마다, 그리고 개발자의 성향마다 모두 달라진다.
middlewares 외에도 configs, core, utils, validation 같은 계층 설계 방식은
프로젝트 규모와 성격에 따라 계속 변한다.

구조가 항상 정답처럼 고정되어 있으면 오히려 확장성과 창의성이 떨어질 수 있다.
정말 중요한 건 각 폴더의 의도와 흐름이 일관되게 유지되는 것이다.
