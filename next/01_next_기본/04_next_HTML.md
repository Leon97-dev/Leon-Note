# HTML 기본 용어 정리

- `HTML 태그 (HTML Tag)`
  \_ <h1>, <p>, <div>처럼 꺾쇠(<>)로 감싼 이름
  \_ 문서의 구조를 정의하는 기본 단위

- `HTML 요소 (HTML Element)`
  \_ 태그 전체 + 그 안의 내용까지 포함한 구조
  \_ 예: <p>안녕하세요</p>

- `HTML 속성 (HTML Attribute)`
  \_ 태그 안에서 동작이나 스타일을 제어하는 설정값
  \_ 예: style, class, id 등

# HTML 태그

**< 레이아웃(구조) 시맨틱 태그 >**
이 여섯 개로 페이지의 전체 “뼈대”를 만든다.

- `<header>`: 페이지나 섹션의 머리 부분
  \_ 특징: 로고, 내비게이션 등

- `<main>`: 문서의 중심 내용
  \_ 특징: 문서에 하나만 권장

- `<footer>`: 하단 영역
  \_ 특징: 저작권, 정보 등

- `<aside>`: 보조 콘텐츠
  \_ 특징: 사이드바, 광고 등

- `<section>`: 주제별 영역 구분
  \_ 특징: 관련된 콘텐츠 묶음

- `<div>`: 의미 없는 단순 컨테이너
  \_ 특징: 레이아웃 정렬용

**< 콘텐츠(내용) 관련 시맨틱 태그 >**
실제 콘텐츠가 채워진 완성형 페이지가 된다.

- `<article>`: 독립적인 콘텐츠 블록
  \_ 특징: 게시글, 뉴스, 블로그 글 등

- `<nav>`: 내비게이션 영역
  \_ 특징: 메뉴 링크 집합

- `<<h1>~<h6>>`: 제목 계층 구조
  \_ 특징: SEO에 영향 큼

- `<p>`: 문단
  \_ 특징: 텍스트 기본 단위

- `<ul> / <ol> / <li>`: 리스트
  \_ 특징: 메뉴, 항목, 순서 표현

- `<a>`: 하이퍼링크
  \_ 특징: 페이지 이동, 외부 링크

- `<img>`: 이미지 삽입
  \_ 특징: 시각 콘텐츠 표현

- `<figure> + <figcaption>`: 이미지나 도표 설명
  \_ 특징: 시각자료와 캡션 묶음

- `<table>`: 표
  \_ 특징: 데이터 표시용

- `<form>`: 사용자 입력 영역
  \_ 특징: 로그인, 검색창 등

- `<button>`: 클릭 가능한 버튼
  \_ 특징: 폼 전송, 인터랙션 처리

# HTML 속성

**< 모든 태그에서 공통으로 자주 쓰이는 속성 >**

- `id`: 요소의 고유 식별자
  \_ 예시: <div id="header"></div>

- `class`: 여러 요소에 공통 스타일 지정
  \_ 예시: <p class="intro"></p>

- `style`: 인라인 스타일 (CSS 직접 작성)
  \_ 예시: <h1 style="color: red;"></h1>

- `title`: 마우스 올렸을 때 툴팁 표시
  \_ 예시: <button title="클릭하세요">버튼</button>

- `hidden`: 화면에서 숨김 (렌더링 안 됨)
  \_ 예시: <div hidden></div>

**< 자주 쓰는 태그별 주요 속성 >**

- `<img>`
  \_ 속성: `src`: 이미지 파일 경로
  \_ 속성: `alt`: 대체 텍스트
  \_ 속성: `width, height`: 크기 지정
  \_ 예시: <img src="/logo.png" alt="사이트 로고" width="100" />

- `<a>`
  \_ 속성: `href`: 이동할 링크 주소
  \_ 속성: `target`: 새 창 열기 여부 (`_blank`)
  \_ 속성: `rel`: 링크 관계 설정 (보안용 noopener 등)
  \_ 예시: <a href="https://nextjs.org" target="_blank" rel="noopener">Next.js 공식 사이트</a>

- `<input>`
  \_ 속성: `type`: 입력 형식 (text, password, email, checkbox 등)
  \_ 속성: `placeholder`: 안내문구
  \_ 속성: `value`: 기본값
  \_ 속성: `required`: 필수 입력 지정
  \_ 예시: <input type="email" placeholder="이메일 입력" required />

- `<button>`
  \_ 속성: `type`: 버튼 동작 (button, submit, reset)
  \_ 속성: `disabled`: 비활성화
  \_ 속성: `onClick`: 클릭 시 실행될 JS 코드 (React에서 자주 씀)
  \_ 예시: <button type="button" disabled>비활성 버튼</button>

**< React(JSX)에서의 속성 >**
React에서는 HTML 속성 이름 중 일부가 JS 문법에 맞게 변경된다.

- class ➡️ className
- for ➡️ htmlFor
- onclick ➡️ onClick
- tabindex ➡️ tabIndex
