# Prettier — 코드 자동 포맷터

_참고 사이트_
https://prettier.io/

---

# 1. 개요

Prettier는 JavaScript/TypeScript/HTML/CSS/JSON 등 다양한 언어의 코드를 일관된 스타일로 자동 정렬(포맷팅) 해주는 도구다.
개발자마다 들쭉날쭉한 코드 스타일을 통일해 코드 품질과 협업 효율을 높인다.

npm i --save-dev prettier ✅ 설치 필요

---

# 2. 주요 역할

Prettier는 “코드 스타일”만 처리하고, 코드 “문법 오류”는 ESLint가 잡는다.

- 들여쓰기 자동 정렬
- 줄바꿈/세미콜론/따옴표 통일
- 객체/배열/함수 포맷 자동화
- VS Code 저장 시(format on save) 즉시 적용
- 팀 전체 코드 스타일을 강제할 수 있음

---

# 3. 기본 사용법

**< 수동 실행 - 프로젝트 전체 파일 자동 정렬 >**

```bash
npx prettier . --write
```

**< 특정 파일만 >**

```bash
npx prettier src/index.js --write
```

---

# 4. 설정 파일 생성

프로젝트 루트에 .prettierrc 파일 생성

```json
{
  "singleQuote": true,
  "semi": false,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100
}
```

- singleQuote: '따옴표' vs "쌍따옴표"
- semi: 세미콜론 여부
- tabWidth: 들여쓰기 2칸/4칸
- trailingComma: 객체·배열 끝 쉼표
- printWidth: 한 줄 최대 길이

---

# 5. .prettierignore

포맷팅 제외 파일 지정

```bash
node_modules
dist
build
package - lock.json
```

---

# 6. VS Code 연동

settings.json → 저장할 때마다 자동 포맷

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

---

# 7. Prettier + ESLint 함께 쓰기 (실무 표준)

두 도구는 역할이 다르다.
Prettier → “코드 모양” 자동화
ESLint → 문법 오류, best-practice 검사
둘이 충돌이 날 수 있기 때문에, 보통 아래 플러그인을 설치한다.

```bash
npm i --save-dev eslint-config-prettier
```

ESLint 설정에 추가

```json
{
  "extends": ["prettier"]
}
```

→ ESLint가 Prettier와 충돌하는 규칙을 자동 비활성화한다.

---

# 8. 왜 Prettier가 실무에서 거의 필수인가?

- 팀 전체 코드 스타일이 통일됨
- 리뷰할 때 “스타일” 대신 “로직”에 집중 가능
- 저장만 해도 코드 정리 끝
- 협업/오픈소스/대규모 프로젝트에서 필수
