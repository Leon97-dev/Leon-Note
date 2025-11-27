# ESLint — 자바스크립트 코드 품질 검사기

_참고 사이트_
https://eslint.org/

---

# 1. 개요

ESLint는 JavaScript/TypeScript 코드에서 문법 오류, 잠재적 버그, 비추천 패턴, 스타일 규칙을 분석해주는 정적 분석 도구다.
코드 포맷팅을 담당하는 Prettier와 달리,
ESLint는 “코드 품질”과 “문법 안정성”을 책임지는 도구다.

npm i --save-dev eslint ✅ 설치 필요

---

# 2. 주요 역할

ESLint는 “코드가 정상적으로 동작할 수 있는지”를 확인해주는 보안망이다.

- 문법 오류 탐지
- 사용되지 않는 변수/함수 검사
- 위험한 코드 패턴 방지
- best-practice 강제
- import 정리
- TypeScript 규칙 관리 (@typescript-eslint)
- Prettier와 연동 가능

---

# 3. 초기 설정

ESLint CLI로 기본 설정 파일 생성

```bash
npx eslint --init
```

여기서 다음을 선택하게 된다.

- JS/TS 선택
- CommonJS / ESModule
- React 사용 여부
- 규칙 세트 (Airbnb / Standard / Recommended)
- Prettier 연동 여부

루트에 .eslintrc 또는 .eslintrc.json 파일이 생성된다.

---

# 4. 기본 사용

**< 전체 검사 >**

```bash
npx eslint .
```

**< 자동 수정 >**

```bash
npx eslint . --fix
```

---

# 5. .eslintrc 예시 (Node.js + Prettier)

```json
{
  "env": {
    "node": true,
    "es2021": true
  },
  "extends": ["eslint:recommended", "prettier"],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "no-unused-vars": "warn",
    "no-console": "off"
  }
}
```

---

# 6. 대표적인 ESLint 규칙들

**< 오류 방지 관련 >**

```js
no - undef; // 선언되지 않은 변수 사용 금지
no - unused - vars; // 미사용 변수 검사
no - constant - condition;
no - empty;
```

**< best-practice 관련 >**

```js
eqeqeq; // == 대신 === 사용
curly; // if {} 강제
dot - notation; // a['b'] 대신 a.b 권장
```

**< 스타일 관련 (Prettier에 맞기면 비활성화해도 됨) >**

```js
semi; // 세미콜론 강제
quotes; // 따옴표 규칙
indent; // 들여쓰기
```

---

# 7. ESLint + Prettier 함께 쓰기 (실무 표준)

```json
{
  "extends": ["eslint:recommended", "prettier"]
}

{
  "extends": ["prettier"]
}
```

→ ESLint가 Prettier와 충돌하는 규칙을 자동 비활성화한다.

---

# 8. VS Code 자동화 연동

settings.json

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

→ 저장하면 ESLint가 자동 고침(--fix) 수행된다.

# 9. ESLint는 왜 필요한가?

- 프로젝트 규모 커지면 “사소한 실수”가 한두 개가 아니다.
- 팀원마다 스타일/습관이 다르기 때문에 규칙 통일이 필요
- import 누락/미사용 변수/잘못된 async 사용 등 자동으로 잡아줌
- 코드 리뷰 시간 절약

ESLint를 키고 개발하면 “런타임 전에 오류를 미리 잡아주는” 안전장치가 된다.
