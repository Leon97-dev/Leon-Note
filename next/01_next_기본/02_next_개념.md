# next.js 기본 개념

1. Next.js란?

React 애플리케이션을 서버 사이드 렌더링(SSR) 또는 정적 사이트 생성(SSG) 방식으로 실행할 수 있도록 도와주는 프레임워크다.
즉, React의 단점을 보완해서 **SEO(검색 엔진 최적화)**와 성능 개선, 라우팅 자동화, API 서버 내장 등을 제공한다.

2. 핵심 특징

**< 파일 기반 라우팅 >**
pages/ 폴더에 파일을 만들면 자동으로 라우팅된다.

```bash
pages/
├── index.js       →  "/"
├── about.js       →  "/about"
└── blog/[id].js   →  "/blog/1", "/blog/2"
```

**< 서버 사이드 렌더링 (SSR) >**
`getServerSideProps()`를 사용하면 요청이 들어올 때마다 서버에서 HTML을 생성한다.
SEO가 중요하거나, 항상 최신 데이터가 필요한 페이지에 적합하다.

**< 정적 사이트 생성 (SSG) >**
`getStaticProps()`로 미리 HTML을 빌드 시점에 만들어둔다.
빠른 속도와 캐싱이 장점이며, 블로그·문서 사이트에 자주 사용된다.

**< 클라이언트 사이드 렌더링 (CSR) >**
기본 React 방식. 데이터가 자주 바뀌고, SEO가 중요하지 않을 때 사용.

**< API Routes >**
pages/api/ 폴더 안에 파일을 만들면 자동으로 백엔드 API 엔드포인트가 된다.
/api/hello → pages/api/hello.js

**< Image Optimization >**
<Image> 컴포넌트를 사용하면 자동으로 이미지 크기, 포맷(WebP) 등을 최적화한다.

**< App Router (Next.js 13+) >**
app/ 디렉토리를 사용해 React Server Components(RSC) 기반의 구조를 제공한다.
예전 pages보다 더 유연하고 서버 중심의 렌더링 구조를 지원한다.

3. 렌더링 방식 요약

- `SSR`: 서버 사이드 렌더링(Server Side Rendering)
  \_ 함수: getServerSideProps
  \_ 렌더링 시점: 요청 시 (runtime)
  \_ 용도: 실시간 데이터 필요할 때

- `SSG`: 정적 사이트 생성(Static Site Generato)
  \_ 함수: getStaticProps
  \_ 렌더링 시점: 빌드 시 (build time)
  \_ 용도: 변경 없는 정적 페이지

- `ISR`: 증분 정적 재생성(Incremental Static Rendering)
  \_ 함수: getStaticProps + revalidate
  \_ 렌더링 시점: 일정 주기마다 재생성
  \_ 용도: 캐시된 페이지를 주기적으로 갱신

- `CSR`: 클라이언트 사이드 렌더링(Server Side Rendering)
  \_ 함수: useEffect, fetch
  \_ 렌더링 시점: 클라이언트에서 실행
  \_ 용도: 로그인 후 데이터 등

4. Next.js의 내부 구조

```bash
my-app/
├── app/ or pages/
│   ├── index.js
│   ├── about.js
│   └── api/
│       └── hello.js
├── public/          → 정적 파일 ( 이미지, 폰트 등 )
├── styles/          → CSS/SCSS
├── components/      → 공통 UI 컴포넌트
├── next.config.js   → Next.js 설정 파일
└── package.json
```

5. Next.js의 장점 요약

- SEO 친화적: HTML이 서버에서 생성되므로 검색 엔진이 쉽게 인식한다.
- 라우팅 자동화: pages/ 폴더 기반으로 별도 설정 불필요하다.
- 성능 최적화: 이미지, 코드 스플리팅, 프리패칭 자동화
- API 내장: 백엔드 없이 간단한 서버 기능 구현 가능하다.
- 배포 간편: Vercel(베르셀)과 궁합이 매우 좋다. (Next.js 만든 회사)

6.  Next.js vs React 비교

- `Next.js`
  \_ 라우팅: 자동
  \_ SEO 시점: 강함 (SSR, SSG)
  \_ 데이터 패칭: 서버/정적 모두 가능
  \_ 백엔드 기능: 내장 API 라우트 제공
  \_ 배포: Vercel 등과 원클릭 배포

- `React`
  \_ 라우팅: 수동 (React Router 등)
  \_ SEO 시점: 약함 (CSR)
  \_ 데이터 패칭: 클라이언트에서 직접
  \_ 백엔드 기능: 없음
  \_ 배포: 별도 설정 필요
