# Next.js App Router 구조 완전 정리

Next.js 13 이상에서는 app/ 폴더가 모든 페이지의 출발점이다.
이 안에서 폴더가 곧 URL이 되고, 파일이 역할을 가진다는 개념을 이해하면 끝이다.

1. 폴더가 곧 라우트다

폴더를 만들면 → URL이 자동으로 만들어진다.

```bash
app/
 ├── page.js         →  "/"
 ├── about/
 │    └── page.js    →  "/about"
 ├── blog/
 │    ├── page.js    →  "/blog"
 │    └── [id]/
 │         └── page.js  →  "/blog/1", "/blog/2"
```

즉, 폴더 구조 = 라우팅 구조
이건 react-router나 express처럼 직접 라우트 코드를 짜지 않아도 된다는 뜻이다.

2. 주요 파일 역할

- `page.js`: 실제 페이지 내용 (React 컴포넌트)
  \_ 적용 범위: 해당 폴더 라우트

- `layout.js`: 페이지 공통 레이아웃
  \_ 적용 범위: 현재 폴더 + 하위 폴더

- `loading.js`: 로딩 중일 때 표시할 UI
  \_ 적용 범위: 해당 폴더 내 페이지

- `error.js`: 에러 발생 시 표시할 UI
  \_ 적용 범위: 해당 폴더 내 페이지

- `not-found.js`: 404 페이지 전용
  \_ 적용 범위: 해당 폴더 내

- `template.js`: 페이지 간 이동 시 리렌더링 제어
  \_ 적용 범위: 고급 사용

- `head.js (이전 버전) / metadata`: SEO용 메타데이터
  \_ 적용 범위: 페이지별 title, description 설정

3. 가장 기본 구조 예시

```bash
app/
 ├── layout.js
 ├── page.js
 ├── about/
 │    └── page.js
 └── contact/
      ├── page.js
      └── error.js
```

**< layout.js >**
layout.js는 모든 하위 페이지에 자동으로 적용된다.
즉, /about, /contact도 같은 헤더/푸터를 공유한다.

```jsx
export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <header>공통 헤더</header>
        <main>{children}</main>
        <footer>공통 푸터</footer>
      </body>
    </html>
  );
}
```

**< page.js >**

```jsx
export default function HomePage() {
  return <h1>메인 페이지</h1>;
}
```

4. 다이내믹 라우트 (Dynamic Route)

폴더 이름을 대괄호로 감싸면 URL 파라미터가 된다.

```bash
app/
 └── blog/
      └── [id]/
           └── page.js   → /blog/1, /blog/2, /blog/anything
```

```jsx
export default function BlogPage({ params }) {
  return <h1>블로그 글 ID: {params.id}</h1>;
}
```

params 객체는 Next.js가 자동으로 넘겨주는 URL 매개변수다.

5. 중첩 레이아웃

`layout.js`는 폴더별로 만들 수 있고, 각각 상위의 layout.js를 덮지 않고 “중첩”해서 적용된다.

```bash
app/
 ├── layout.js          ( 사이트 전체 )
 └── dashboard/
      ├── layout.js     ( 대시보드 전용 )
      ├── page.js
      └── settings/
           └── page.js
```

결과적으로 /dashboard/settings 페이지는
\_ 전체 layout.js
\_ 대시보드 layout.js
\_ settings/page.js 이 순서로 겹쳐진다.
즉, “페이지별 UI 레벨을 나누는” 기능이 layout.js다.

6. Metadata 설정 (SEO)

페이지별로 title, description 등을 지정할 수 있다.

```jsx
export const metadata = {
  title: '레온의 블로그',
  description: 'Next.js 공부 노트',
};

export default function Page() {
  return <h1>블로그 페이지</h1>;
}
```

Next.js는 이 정보를 자동으로 <head> 태그에 넣어줘서 검색엔진(SEO)에도 최적화된다.
