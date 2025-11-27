# Node.js 내장 모듈 — stream

_참고 사이트_
https://nodejs.org/api/stream.html

1️⃣ 개요

데이터를 한 번에 모두 읽거나 쓰지 않고,
작은 조각(chunk) 단위로 처리할 수 있게 해주는 Node.js 내장 모듈이다.
대표적으로 파일 입출력, HTTP 요청/응답, 네트워크 소켓, 압축 등
모든 데이터 흐름이 스트림 기반으로 작동한다.

import fs from 'fs'; ❌ 설치 불필요

2️⃣ 왜 스트림을 쓰나?

- `일반 읽기`: 한 번에 전체 파일/데이터를 메모리에 적재
- `스트림 읽기`: 데이터가 들어올 때마다 조금씩 처리 (메모리 효율 ↑)

예를 들어 5GB짜리 영상을 fs.readFile()로 읽으면 메모리가 터진다.
하지만 createReadStream()은 조각으로 나누어 읽으니 메모리 사용량이 일정하게 유지된다.

3️⃣ 스트림의 4가지 종류

- `Readable`: 데이터 읽기
  \_ fs.createReadStream(), http.IncomingMessage

- `Writable`: 데이터 쓰기
  \_ fs.createWriteStream(), http.ServerResponse

- `Duplex`: 읽기 + 쓰기
  \_ net.Socket

- `Transform`: 읽기/쓰기 + 변환
  \_ zlib.createGzip() (압축 등)

4️⃣ Readable Stream 예시

내부적으로 events 모듈의 'data', 'end', 'error' 이벤트를 사용한다.

```js
import fs from 'fs';

const readStream = fs.createReadStream('bigfile.txt', 'utf-8');

readStream.on('data', (chunk) => {
  console.log('읽는 중:', chunk.length, 'bytes');
});

readStream.on('end', () => {
  console.log('파일 읽기 완료');
});

readStream.on('error', (err) => {
  console.error('에러 발생:', err.message);
});
```

5️⃣ Writable Stream 예시

.end()는 “마지막 데이터까지 쓰고 스트림 종료”를 의미한다.

```js
import fs from 'fs';

const writeStream = fs.createWriteStream('output.txt');

writeStream.write('Node.js Stream Test\n');
writeStream.write('데이터를 이어서 씁니다.\n');
writeStream.end('마지막 줄입니다.\n');

writeStream.on('finish', () => {
  console.log('파일 쓰기 완료');
});
```

6️⃣ 파이핑(Pipe)

읽기 스트림과 쓰기 스트림을 연결하면,
데이터가 자동으로 흘러간다 — 복사, 변환, 전송에 매우 효율적이다.
pipe()는 “Readable → Writable” 간의 연결 통로다.
한 줄로 대용량 복사를 처리할 수 있다.

```js
import fs from 'fs';

const readStream = fs.createReadStream('input.txt');
const writeStream = fs.createWriteStream('copy.txt');

readStream.pipe(writeStream);
```

7️⃣ Transform Stream (데이터 변환)

읽으면서 동시에 변환하는 스트림이다.
예를 들어 텍스트를 모두 대문자로 바꾸는 변환 스트림이다.
콘솔에 입력한 텍스트가 실시간으로 대문자로 변환되어 출력된다.

```js
import { Transform } from 'stream';

const upperCase = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  },
});

process.stdin.pipe(upperCase).pipe(process.stdout);
```

8️⃣ 실무 활용 예시

**< 파일 압축 (zlib + stream) >**

```js
import fs from 'fs';
import zlib from 'zlib';

const read = fs.createReadStream('data.txt');
const gzip = zlib.createGzip();
const write = fs.createWriteStream('data.txt.gz');

read.pipe(gzip).pipe(write);
```

**< HTTP 응답 스트리밍 >**
파일 전체를 메모리에 올리지 않고, 브라우저에 실시간 스트리밍 전송한다.

```js
import http from 'http';
import fs from 'fs';

const server = http.createServer((req, res) => {
  const fileStream = fs.createReadStream('video.mp4');
  res.writeHead(200, { 'Content-Type': 'video/mp4' });
  fileStream.pipe(res);
});

server.listen(3000);
```

9️⃣ 주요 이벤트 요약

- `'data'`: 새로운 데이터 chunk가 도착했을 때
- `'end'`: 데이터 전송이 끝났을 때
- `'error'`: 오류 발생 시
- `'finish'`: Writable 스트림의 모든 데이터 기록 완료 시
- `'pipe'`: 다른 스트림이 연결될 때 발생
- `'unpipe'`: 스트림 연결이 해제될 때 발생

🔟 스트림 흐름 제어 (Flow Control)

Readable 스트림은 자동 흐름 모드(auto-flowing)와 수동 흐름 모드(paused)가 있다.
.pause() / .resume() 으로 데이터를 일시 중지하거나 재개할 수 있다.

```js
const stream = fs.createReadStream('bigfile.txt');

// 자동 흐름 모드 (기본)
stream.on('data', (chunk) => console.log(chunk));

// 수동 흐름 모드
stream.pause();
setTimeout(() => stream.resume(), 2000);
```
