# Next.js 초기 세팅 가이드

# 1. 사전 준비

node -v
npm -v

# 2. 프로젝트 생성

mkdir next-starter && cd next-starter (폴더 생성)
npx create-next-app@latest . (설치 명령어)

# 3. 프롬프트 권장 답변

- TypeScript: `No`
- ESLint: `Yes`
- Tailwind: `필요 시 선택 (학습용은 No 가능)`
- src/ 디렉토리: `No`
- App Router: `Yes`
- Import alias(@/\*): `No (기본값 유지)`

# 4. 개발 서버 실행

npm run dev 서버 연결 확인

# 5. 필수 스크립트 (package.json 확인)

create-next-app이 기본으로 추가하니 아래처럼 확인 필요

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

# 6. 디렉토리 구조 (App Router 기준)

```go
app/
 ├─ layout.js        // 공통 레이아웃
 ├─ page.js          // 홈 페이지 (/)
 ├─ globals.css      // 글로벌 스타일 (옵션)
public/              // 정적 파일 (이미지 등)
next.config.js       // Next.js 설정
.eslintrc.json       // ESLint 설정
```

# 7. 환경변수 설정

다음 파일을 루트에 생성 .env.local

```env
# 클라이언트/서버 공통 사용 가능(서버 기본)
# 브라우저로 노출 필요한 값은 반드시 NEXT_PUBLIC_ 접두사 사용
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

_규칙_
서버 전용 값: **API_SECRET_KEY** 처럼 접두사 없이 사용
브라우저 노출 필요 값: **NEXT_PUBLICP_q** 접두사 필수

# 8. .gitignore

기본 생성되지만, 누락 시 추가

```bash
# dependencies
node_modules/

# builds
.next/
out/

# env
.env*
!.env.example

# OS
.DS_Store
```

원한다면 .env.example도 추가

```env
# .env.example
NEXT_PUBLIC_API_BASE_URL=
```

# 9. next.config.js (필수 최소 설정)

초기에는 기본값으로 충분. 이미지 외부 도메인 쓰면 아래처럼 추가

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'images.example.com' }],
  },
};

module.exports = nextConfig;
```

# 10. ESLint & Prettier (정렬/포맷 통일)

**< 패키지 설치 >**
npm i -D prettier eslint-config-prettier eslint-plugin-prettier

**< .eslintrc.json (예시) >**
create-next-app 기본 설정에 prettier 플러그인만 추가

```json
{
  "extends": ["next/core-web-vitals", "plugin:prettier/recommended"]
}
```

**< .prettierrc (예시) >**

```json
{
  "singleQuote": true,
  "semi": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2
}
```

**< VSCode 설정(선택) >**
.vscode/settings.json 생성

```json
{
  "editor.formatOnSave": true,
  "[javascript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[javascriptreact]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[typescript]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[typescriptreact]": { "editor.defaultFormatter": "esbenp.prettier-vscode" },
  "[markdown]": {
    "editor.defaultFormatter": "darkriszty.markdown-table-prettify"
  }
}
```

# 11. 추천 모듈 (선택)

**< HTTP 클라이언트 >**
Next.js는 기본 fetch로 충분하지만, 취향에 따라 선택이다.

```bash
# axios 또는 ky 중 택1
npm i axios
# or
npm i ky
```

**< 상태관리(가벼움) >**
npm i zustand

**< 유틸리티 >**
npm i clsx
npm i -D cross-env

_메모_
fetch는 서버/클라이언트 어디서든 사용 가능(Next가 Polyfill 제공)
클라이언트 컴포넌트에서만 상호작용 필요하면 use client 선언

# 12. 기본 페이지/레이아웃 샘플

**< app/layout.js >**

```jsx
export const metadata = {
  title: '앱 시작',
  description: 'Next.js Starter',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <header style={{ padding: 12, background: '#f4f4f4' }}>Header</header>
        <main>{children}</main>
        <footer style={{ padding: 12, background: '#f4f4f4' }}>Footer</footer>
      </body>
    </html>
  );
}
```

**< app/page.js >**

```jsx
export default function Page() {
  return <h1>Next.js 초기 세팅 완료</h1>;
}
```

# 13. 빌드 & 실행

npm run build
npm start

개발용: npm run dev
린트: npm run lint

# 14. 자주 나는 초반 오류 체크리스트

- app/ 폴더 누락 → App Router 동작 안 함
- **NEXT_PUBLIC_q** 접두사 없이 클라이언트에서 env 접근 → 값 노출 안 됨
- 이미지 외부 도메인 사용 시 next.config.js 설정 누락 → 이미지 로드 실패
- 포맷 충돌(Prettier vs 다른 포맷터) → .eslintrc.json에 plugin:prettier/recommended로 정리
