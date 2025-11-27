# Node.js 내장 모듈 — http / https

_참고 사이트_
https://nodejs.org/api/http.html
https://nodejs.org/api/https.html

1️⃣ 개요

Node.js에서 웹 서버를 직접 만들고, 클라이언트 요청을 처리하기 위한 내장 네트워크 모듈이다.
http는 암호화되지 않은 기본 통신,
https는 SSL/TLS 인증서를 적용한 보안 통신을 담당한다.

import http from 'http'; ❌ 설치 불필요
import https from 'https'; ❌ 설치 불필요

2️⃣ http 서버의 기본 구조

```js
// 최소한의 웹 서버
import http from 'http';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('안녕하세요, 레온 서버입니다!');
});

server.listen(3000, () => {
  console.log('HTTP 서버 실행 중: http://localhost:3000');
});
```

- `createServer()`: 요청이 들어오면 콜백 실행
- `req`: 클라이언트 요청 정보
- `res`: 서버 응답 객체
- `writeHead()`: 응답 헤더 설정
- `end()`: 응답 본문 종료

3️⃣ 요청(Request) 객체 (req)

req는 클라이언트가 보낸 정보를 담는다.

- `req.url`: 요청 경로
- `req.method`: HTTP 메서드 (GET, POST, PUT, DELETE 등)
- `req.headers`: 요청 헤더 정보
- `req.on('data')`: 요청 본문 데이터 수신 이벤트
- `req.on('end')`: 요청 본문 수신 완료 이벤트

```js
http.createServer((req, res) => {
  console.log(req.method, req.url);
  res.end('ok');
});
```

4️⃣ 응답(Response) 객체 (res)

- `res.writeHead(statusCode, headers)`: 상태 코드 + 헤더 설정
- `res.write(data)`: 응답 본문 쓰기
- `res.end([data])`: 응답 종료 (본문 출력)

```js
res.writeHead(200, { 'Content-Type': 'application/json' });
res.end(JSON.stringify({ message: 'Success' }));
```

5️⃣ 라우팅 예시 (기초 라우터)

Express 같은 프레임워크는 이 구조를 “자동화 + 간소화”해주는 것뿐이다.

```js
const server = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('홈페이지');
  } else if (req.url === '/about') {
    res.end('소개 페이지');
  } else {
    res.writeHead(404);
    res.end('페이지를 찾을 수 없습니다.');
  }
});
```

6️⃣ 요청 본문 읽기 (POST 데이터 수신)

HTTP 서버는 body-parser가 없기 때문에 직접 처리해야 한다.

```js
const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      console.log('받은 데이터:', body);
      res.end('데이터 수신 완료');
    });
  } else {
    res.end('POST 요청만 허용');
  }
});
```

7️⃣ HTTPS 서버 (보안 통신)

HTTPS는 SSL/TLS 인증서를 필요로 한다. (key = 비공개키, cert = 공개 인증서)
로컬 개발에서는 mkcert나 openssl로 테스트용 인증서를 만들 수 있다.
실제 배포 시엔 Let’s Encrypt, AWS ACM, Cloudflare 등으로 관리한다.

```js
import fs from 'fs';
import https from 'https';

const options = {
  key: fs.readFileSync('./ssl/private.key'),
  cert: fs.readFileSync('./ssl/certificate.crt'),
};

const server = https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('HTTPS 보안 연결 성공');
});

server.listen(443, () => console.log('HTTPS 서버 실행 중 (포트 443)'));
```

8️⃣ 서버/클라이언트 역할 분리

**< 서버(Server) >**

```js
http.createServer((req, res) => res.end('Hello')).listen(8080);
```

**< 클라이언트(Client) >**
http.get()으로 다른 서버에 요청도 가능하다. (Axios 같은 역할의 기본형)

```js
http.get('http://localhost:8080', (res) => {
  res.on('data', (chunk) => console.log(chunk.toString()));
});
```

9️⃣ 자주 쓰는 응용 패턴

**< 서버 포트 자동 재사용 방지 >**

```js
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error('포트가 이미 사용 중입니다.');
  }
});
```

**< JSON 응답 헬퍼 >**

```js
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}
```
