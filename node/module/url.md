# Node.js 내장 모듈 — url

_참고 사이트_
https://nodejs.org/api/url.html

1️⃣ 개요

URL 문자열을 파싱, 해석, 수정, 조합하는 기능을 제공하는 Node.js 내장 모듈이다.
Node.js는 두 가지 URL 방식 모두 지원한다.

- `LEGACY API`: url.parse() 기반 (구버전)
- `WHATWG URL API`: ECMAScript 표준 URL 클래스 기반 (권장)

import { URL } from 'url'; ❌ 설치 불필요

2️⃣ 기본 사용법

```js
import { URL } from 'url';

const myURL = new URL('https://leon.dev:8080/posts?id=123&tag=node#section1');
console.log(myURL);

// 출력 결과
URL {
  href: 'https://leon.dev:8080/posts?id=123&tag=node#section1',
  origin: 'https://leon.dev:8080',
  protocol: 'https:',
  username: '',
  password: '',
  host: 'leon.dev:8080',
  hostname: 'leon.dev',
  port: '8080',
  pathname: '/posts',
  search: '?id=123&tag=node',
  hash: '#section1'
}
```

3️⃣ 주요 속성

- `href`: 전체 URL 문자열
  \_ 'https://leon.dev/posts?id=1'

- `protocol`: 프로토콜
  \_ 'https:'

- `hostname`: 호스트명(도메인)
  \_ 'leon.dev'

- `port`: 포트 번호
  \_ '8080'

- `pathname`: 경로(루트 이후 부분)
  \_ '/posts'

- `search`: 쿼리 문자열 전체
  \_ '?id=1&tag=node'

- `hash`: 해시(anchor) 부분
  \_ '#section1'

- `origin`: 프로토콜 + 도메인 + 포트
  \_ 'https://leon.dev:8080'

4️⃣ 쿼리 파라미터 조작 (searchParams)

```js
URL 객체는 URLSearchParams를 내장해, 쿼리 문자열을 쉽게 다룰 수 있다.

const myURL = new URL('https://leon.dev/posts?id=10&tag=node');

console.log(myURL.searchParams.get('id')); // 10
myURL.searchParams.append('author', 'leon');
myURL.searchParams.set('id', '99');
myURL.searchParams.delete('tag');

console.log(myURL.toString());
// https://leon.dev/posts?id=99&author=leon
```

- `get(name)`: 특정 파라미터 값 조회
- `set(name, value)`: 값 수정 (중복 시 덮어쓰기)
- `append(name, value)`: 값 추가 (중복 허용)
- `delete(name)`: 파라미터 삭제
- `has(name)`: 파라미터 존재 여부 확인
- `toString()`: 문자열로 변환

5️⃣ 상대 경로 처리 (base URL)

상대 URL을 절대 경로로 변환할 수 있다.

```js
const base = new URL('https://leon.dev/blog/');
const relative = new URL('post/10', base);
console.log(relative.href);
// https://leon.dev/blog/post/10
```

6️⃣ 구버전 방식 (url.parse)

Node.js 10 이후로는 WHATWG 방식 사용을 권장하지만,
기존 프로젝트에서는 여전히 많이 볼 수 있다.

```js
import url from 'url';

const parsed = url.parse('https://leon.dev:8080/posts?id=123&tag=node', true);
console.log(parsed.hostname); // leon.dev
console.log(parsed.query); // { id: '123', tag: 'node' }
```

- `url.parse(urlStr, parseQueryString)`: URL 파싱
- `url.format(urlObject)`: URL 객체를 문자열로 변환
- `url.resolve(from, to)`: 경로 합치기

7️⃣ 실무 활용 예시

**< 요청 URL 분석 (Express 없이) >**

```js
import http from 'http';
import { URL } from 'url';

const server = http.createServer((req, res) => {
  const parsed = new URL(req.url, `http://${req.headers.host}`);
  const id = parsed.searchParams.get('id');

  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(`요청한 게시글 ID: ${id}`);
});

server.listen(3000);
```

**< API 요청 시 쿼리 생성 >**

```js
const base = new URL('https://api.example.com/search');
base.searchParams.set('q', 'nodejs');
base.searchParams.set('limit', '10');
console.log(base.toString());
// https://api.example.com/search?q=nodejs&limit=10
```

8️⃣ URLSearchParams 단독 사용

URLSearchParams는 단독으로도 쿼리 문자열을 다룰 수 있다.

```js
const params = new URLSearchParams('name=leon&lang=ko');
params.append('stack', 'nodejs');
console.log(params.toString()); // name=leon&lang=ko&stack=nodejs
```

# 보조 모듈: fileURLToPath()와 pathToFileURL()

1️⃣ 등장 배경

ESM(import/export) 환경에서는 `__dirname`이나 `__filename`이 존재하지 않는다.
그래서 현재 모듈의 파일 경로나 디렉터리를 얻으려면,
URL 객체를 파일 경로로 바꾸는 이 함수들이 필요하다.

2️⃣ fileURLToPath(url)

파일 URL (file:///로 시작하는 경로)을 로컬 파일 시스템 경로로 변환한다.

```js
import { fileURLToPath } from 'url';
import path from 'path';

// 현재 파일의 절대 경로 구하기
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__filename);
console.log(__dirname);

// 출력 결과
// /Users/leon/project/src/app.js
// /Users/leon/project/src
```

이렇게 하면 ESM에서도 CommonJS의 `__dirname`, `__filename`과 똑같이 쓸 수 있다.

3️⃣ pathToFileURL(path)

반대로 로컬 파일 경로를 파일 URL로 변환한다.

```js
import { pathToFileURL } from 'url';

const fileURL = pathToFileURL('/Users/leon/project/src/app.js');
console.log(fileURL.href);
// file:///Users/leon/project/src/app.js
```

4️⃣ 왜 중요한가?

- ESM 환경("type": "module")에서는 `__dirname`이 없기 때문이다.
- 파일 업로드, 설정 파일 로드, fs 접근 등에서 경로가 필요할 때 자주 사용한다.
- path 모듈과 짝꿍처럼 함께 쓰인다.
