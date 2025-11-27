# 📁 Utils 폴더 개념

## ✦ 의도

utils 폴더는 프로젝트 전반에서 반복적으로 사용되는
순수 함수(pure functions), **작은 기능 단위 헬퍼(helper)**들을 모아두는 계층이다.

즉, “어디에도 속하지 않지만 곳곳에서 필요한 기능”들이 모이는 도구 상자(Toolbox) 역할이다.

Utils는 컨트롤러·서비스·레포지토리 어디에서도 재사용될 수 있다.

---

## ✦ 유틸 역할 (Utils Responsibility)

### ✔ 1) 공통 기능 추출

프로젝트 곳곳에서 반복되는 기능을 하나로 모아 코드 중복을 없앤다.

- 숫자 파싱 함수
- 문자열 정리 함수
- 비밀번호 해싱 함수
- 날짜 변환, 포맷팅
- 파일 경로 처리 등등...

반복되면 일단 utils로 뺀다.

### ✔ 2) 순수 함수 기반

utils는 외부 상태에 의존하지 않는 것이 이상적이다.

- req, res를 받지 않음
- DB 접근 X
- 내부 상태를 기억하지 않음

입력 → 출력이 명확해야 재사용성이 높기 때문이다.

### ✔ 3) 특정 계층에 종속되지 않음

- routes에서 사용할 수도 있고
- services에서도 사용할 수 있고
- repositories에서도 주입할 수 있다

Utils는 어디든지 가져다 쓰는 범용 계층이다.

---

## ✦ Utils가 해선 안 되는 것 (금지 영역)

### ✘ 1) 비즈니스 로직 넣기

utils는 순수함수 저장소이지, 도메인 규칙이 들어가는 곳이 아니다.

### ✘ 2) DB 접근

Repository에서 해야 함.

### ✘ 3) req, res 사용

Express 계층과 완전히 분리해야 한다.

### ✘ 4) 환경 변수 직접 사용

가능한 한 config 계층에서 가져오도록 분리하는 것이 좋다.

---

## ✦ Utils 구성 예시

### ✔ 1) to-int.js

```js
export function toIntOrThrow(value, path) {
  const num = Number(value);
  if (!Number.isInteger(num) || num < 1) {
    throw new ValidationError(path, `${path}는 1 이상의 정수여야 합니다.`);
  }
  return num;
}
```

### ✔ 2) to-hash.js (비밀번호 해싱)

```js
export function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(raw, hashed) {
  return bcrypt.compare(raw, hashed);
}
```

### ✔ 3) to-content.js (텍스트 검증)

```js
export function assertContent(content) {
  if (!content || content.trim().length < 1) {
    throw new ValidationError('content', '내용은 최소 1자 이상이어야 합니다.');
  }
  return content.trim();
}
```

---

## ✦ Utils의 장점

### ✔ 코드 재사용성 극대화

중복 제거 → 유지보수 쉬움.

### ✔ 테스트 쉬움

순수 함수라 mock 필요 없이 단위 테스트 가능.

### ✔ 계층 간 결합도 감소

컨트롤러/서비스/레포지토리 모두 이 함수로만 연결되므로 역할 분리 유지.

### ✔ 프로젝트 전체 품질 향상

작은 유틸 모음이 프로젝트를 튼튼하게 만든다.

---

## ✦ Utils를 만들 때 기준

- 반복되면 utils로 이동
- DB 접근하면 repository
- req/res를 보면 controller
- 비즈니스 규칙이면 service
- 환경 의존이면 config

이 기준만 지키면 구조가 엉키지 않는다.

---

## ✦ 정리

utils는 프로젝트의 “밑바닥 체력”을 담당한다.
작고 가벼운 순수 함수들이 모여 전체 코드를 단단하게 만든다.

- 반복 제거
- 규칙 분리
- 재사용성 강화
- 테스트 용이

Utils 계층은 프로젝트가 커질수록 그 가치가 점점 더 커진다.

---

## ✦ 핵심

폴더 구조는 회사마다, 팀마다, 그리고 개발자의 성향마다 모두 달라진다.
middlewares 외에도 configs, core, utils, validation 같은 계층 설계 방식은
프로젝트 규모와 성격에 따라 계속 변한다.

구조가 항상 정답처럼 고정되어 있으면 오히려 확장성과 창의성이 떨어질 수 있다.
정말 중요한 건 각 폴더의 의도와 흐름이 일관되게 유지되는 것이다.
