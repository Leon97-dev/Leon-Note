# app/layout.js 분석

```jsx
export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <header style={{ background: '#eee', padding: '10px' }}>
          <h2>공통 헤더</h2>
        </header>
        <main>{children}</main>
        <footer style={{ background: '#eee', padding: '10px' }}>
          <p>공통 푸터</p>
        </footer>
      </body>
    </html>
  );
}
```

_========================================================================================_

# **Q. RootLayout({ children }) 고정인가?**

```jsx
export default function RootLayout({ children }) {}
```

RootLayout({ children }) 형태는 고정이지만 이름은 자유다.

## **구조적으로 고정된 건 “props 구조”, 이름은 자유**

Next.js는 layout.js 파일을 찾으면 내부에서 자동으로 React 컴포넌트로 인식한다.
이때 layout.js가 받는 매개변수(props)는 Next.js가 미리 정한 구조로 주입된다.
즉, Next.js는 렌더링할 때 아래처럼 동작하는 것이다.

```jsx
RootLayout({ children: <현재 페이지의 컴포넌트 /> });
```

그래서 함수의 매개변수 구조({ children })는 고정, 하지만 함수명(RootLayout)은 바꿔도 된다.

## **Next.js는 children 외에도 아래처럼 추가 props를 지원한다. (고급 기능)**

```jsx
export default function Layout({ children, params }) {
  console.log(params); // 동적 라우트인 경우 사용 가능
  return <>{children}</>;
}
```

_========================================================================================_

# **Q. en을 ko로 바꾼 이유?**

```jsx
<html lang="ko"></html>
```

문서의 기본 언어(language attribute)를 한국어로 지정하기 위해서다.
브라우저나 검색엔진이 HTML을 읽을 때,
“이 페이지는 어떤 언어로 작성된 페이지인가?”를 인식하는 국제 웹 표준 설정이다.

## **실제로 중요한 이유**

1. `SEO (검색 엔진 최적화)`
   Google, Naver, Bing 같은 검색엔진은 lang="ko" 값을 보고 페이지 언어를 정확히 인식한다.
   이렇게 해야 한국어 검색 결과에 노출될 확률이 높아진다.

2. `접근성 (Accessibility)`
   화면 낭독기(Screen Reader)는 lang 속성을 기준으로 발음 방식과 음성 합성 언어를 자동 선택한다.
   즉, 시각장애인용 리더가 영어 대신 한국어 발음으로 읽어준다.

3. `문자 인코딩 안정성`
   Next.js는 자동으로 UTF-8을 설정하지만,
   언어 태그를 지정하면 브라우저가 글자 깨짐을 더 정확히 방지할 수 있다.

_========================================================================================_

# **Q. <> 태그 방식은 고정인가? 커스텀이 가능한가?**

<header>, <main>, <footer>는 고정이 전혀 아니고,
전부 개발자가 자유롭게 구성할 수 있는 커스텀 영역이다.

## **고정된 건 없다 — 전부 “내 마음대로”다**

Next.js는 이렇게 말하는 프레임워크다.
“난 네가 반환한 JSX를 그대로 그릴게. 대신 <main>{children}</main> 안에 각 페이지를 끼워넣을게.”
즉, <header>, <main>, <footer>의 위치나 개수, 순서 전부 본인 선택이다.

_========================================================================================_

# **Q. style={} 객체는 고정인가?**

JSX 안에서 HTML의 style 속성은 문자열이 아니라 객체(Object)로 작성해야 오류가 안 생긴다.
JS 안에서 쓰니까, style 속성에 자바스크립트 객체를 전달해야 한다.
전체 구조 style={{ ... }} → “객체를 한 번 더 감싸서” JSX 안에서 JS로 전달
즉, 이중 중괄호의 의미는 “JSX 안에서 JS 객체를 집어넣는다.”

그리고 커스텀도 마음대로 가능하다.

```jsx
<header style={{ backgroundColor: 'black', color: 'white', padding: '1rem' }}>
```

하지만, CSS를 따로 빼는 방식을 추천한다.
Next.js에서는 인라인 스타일보단 외부 CSS 파일이나 CSS Module을 자주 쓴다.
그래야 유지보수가 훨씬 편해진다.

```jsx
// app/globals.css
header {
  background: #eee;
  padding: 10px;
}

// app/layout.js
<header>공통 헤더</header>
```

_========================================================================================_

이건 Next.js 규칙이 아니라 HTML의 의미론적 구조(semantic structure)이다.

<header>
- 의미: 페이지나 섹션의 상단 영역
- 특징: 보통 로고, 내비게이션 메뉴

<main>
- 의미: 문서의 핵심 내용
- 특징: 한 문서에 하나만 있는 게 권장됨

<footer>
- 의미: 페이지의 하단 영역
- 특징: 저작권, 회사 정보 등

<aside>
- 의미: 보조 콘텐츠
- 특징: 사이드바, 광고, 링크 모음 등

<section>
- 의미: 주제별 구역 나누기
- 특징: “공지사항”, “리뷰” 같은 묶음

<div>
- 의미: 의미 없는 단순 컨테이너
- 특징: 레이아웃 잡을 때 사용 (기본기중 기본)

_========================================================================================_

# **Q. Next.js가 children을 렌더링하는 순서는?**

1. layout.js 렌더링

<html> → <body> → <main>{children}</main>

2. 그다음

→ 해당 경로의 `page.js`가 children으로 들어감

3. 즉, 실제 브라우저에 그려지는 건 이런 구조다.

```jsx
<html lang="ko">
  <body>
    <header>공통 헤더</header>

    <main>
      <!-- 여기 안에 page.js의 내용이 들어감 -->
      <h1>메인 페이지</h1>
    </main>

    <footer>공통 푸터</footer>
  </body>
</html>
```

_========================================================================================_

## **핵심 용어**

- `HTML 태그 (HTML Tag)`
  \_ <h1>, <p>, <div>처럼 꺾쇠(<>)로 감싼 이름
  \_ 문서의 구조를 정의하는 기본 단위

- `HTML 요소 (HTML Element)`
  \_ 태그 전체 + 그 안의 내용까지 포함한 구조
  \_ 예: <p>안녕하세요</p>

- `HTML 속성 (HTML Attribute)`
  \_ 태그 안에서 동작이나 스타일을 제어하는 설정값
  \_ 예: style, class, id 등

_========================================================================================_
