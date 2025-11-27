# 📁 Constant 폴더 개념

## ✦ 의도

constant 폴더는 프로젝트의 **도메인 규칙이나 변하지 않는 값들을 한곳에 모아두는 공간**이다.
즉, 환경 설정(config)처럼 외부 조건에 따라 달라지는 값이 아니라,
**서비스 로직이 고정적으로 사용하는 상수(Constant)**들을 모아 관리한다.

이렇게 상수를 분리하면:

- 중복 문자열 제거
- 오타 방지
- 수정 시 단일 파일 변경
- 팀 단위 협업 시 가독성 향상

같은 이점이 생겨 유지보수가 매우 쉬워진다.

---

## ✦ 어떤 것들이 들어가는가?

### ✔ 1) 도메인 ENUM / 옵션 값

예: 게시글 정렬 기준, 유저 역할(role), 주문 상태(status)

### ✔ 2) 서비스 로직에서 반복되는 키 값

예: 기본 정렬값(default order), 고정된 범주(category), rating-level 등

### ✔ 3) 프론트와 백엔드 간 “약속된 규칙 값”

예: 필터 옵션 이름, 정렬 기준, 타입 명칭 등
— 이런 값들을 constant로 분리하면 양쪽에서 동일한 키를 사용할 수 있음

### ✔ 4) 바뀌지 않는 문자열, 숫자 값

예: LIMIT, 기본 페이지 사이즈, 포인트 규칙 등

---

## ✦ 예시: 게시글(article) 상수

```js
export const ARTICLE_ORDER = {
  RECENT: 'recent',
  OLDEST: 'oldest',
};

export const ARTICLE_ORDER_MAP = {
  [ARTICLE_ORDER.RECENT]: { createdAt: 'desc' },
  [ARTICLE_ORDER.OLDEST]: { createdAt: 'asc' },
};

export const DEFAULT_ARTICLE_ORDER = ARTICLE_ORDER.RECENT;
```

---

## ✦ 정리

constant 폴더는 기능 로직에서 반복되는 값들을 한 곳에 모아
가독성, 유지보수성, 협업 효율을 모두 높이는 핵심적인 구조다.
이 구조는 실무 프로젝트에서도 아주 많이 쓰이며,
service/controller가 더 깔끔해지고 버그를 줄이는 데 큰 도움을 준다.

---

## ✦ 핵심

폴더 구조는 회사마다, 팀마다, 그리고 개발자의 성향마다 모두 달라진다.
middlewares 외에도 configs, core, utils, validation 같은 계층 설계 방식은
프로젝트 규모와 성격에 따라 계속 변한다.

구조가 항상 정답처럼 고정되어 있으면 오히려 확장성과 창의성이 떨어질 수 있다.
정말 중요한 건 각 폴더의 의도와 흐름이 일관되게 유지되는 것이다.
