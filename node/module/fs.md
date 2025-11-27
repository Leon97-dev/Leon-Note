# Node.js 내장 모듈 — fs (File System)

_참고 사이트_
https://nodejs.org/api/fs.html

# 개요

파일 생성, 읽기, 수정, 삭제 등 모든 파일 입출력 기능을 담당하는 Node.js 내장 모듈이다.
운영체제의 파일 시스템과 직접 상호작용하기 때문에,
CLI에서 하던 cat, mkdir, rm, cp 명령들을 Node 코드로 수행할 수 있다.

import fs from 'fs'; ❌ 설치 불필요

---

# 주요 역할

- 파일 읽기 / 쓰기 (readFile, writeFile)
- 폴더 생성 / 삭제 (mkdir, rmdir)
- 파일 존재 여부 확인 (existsSync)
- 스트림 기반 파일 처리 (createReadStream, createWriteStream)
- 비동기/동기 모드 제공 (fs vs fs/promises)

---

# 비동기 vs 동기 방식

- `비동기(Async)`: 논블로킹, 콜백/프로미스 기반, 서버에서 권장
  \_ fs.readFile('a.txt', cb)

- `동기(Sync)`: 블로킹, 코드 실행 중 멈춤, 초기 스크립트용
  \_ fs.readFileSync('a.txt')

---

# 파일 읽기 (read)

**< 비동기 >**

```js
fs.readFile('data.txt', 'utf-8', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

**< 동기 >**

```js
const data = fs.readFileSync('data.txt', 'utf-8');
console.log(data);
```

---

# 파일 쓰기 (write)

```js
fs.writeFile('output.txt', 'Hello, Leon!', (err) => {
  if (err) throw err;
  console.log('파일이 저장되었습니다.');
});
```

writeFileSync 버전도 동일하게 존재한다.
기존 파일이 있으면 덮어쓴다.

---

# 파일 추가 (append)

```js
fs.appendFile('log.txt', '\n새 로그 추가됨', (err) => {
  if (err) throw err;
});
```

기존 내용 유지 + 새로운 데이터만 추가한다.

---

# 파일 삭제 (delete)

```js
fs.unlink('output.txt', (err) => {
  if (err) throw err;
  console.log('파일 삭제 완료');
});
```

---

# 폴더 관련 기능

**< 폴더 생성 >**

```js
fs.mkdir('uploads', { recursive: true }, (err) => {
  if (err) throw err;
  console.log('폴더 생성 완료');
});
```

recursive: true를 주면 중첩 폴더까지 한 번에 생성 가능.

**< 폴더 삭제 >**

```js
fs.rm('uploads', { recursive: true, force: true }, (err) => {
  if (err) throw err;
  console.log('폴더 삭제 완료');
});
```

---

# 파일 존재 여부 확인

```js
if (fs.existsSync('config.json')) {
  console.log('파일이 존재합니다.');
}
```

existsSync()는 동기식이며, 빠른 체크용으로만 사용 권장한다.

---

# 파일/폴더 정보 확인

```js
fs.stat('data.txt', (err, stats) => {
  if (err) throw err;
  console.log(stats.isFile()); // true
  console.log(stats.size); // 바이트 단위 크기
});
```

---

# 스트림 기반 입출력 (대용량 파일 처리)

**< 읽기 스트림 >**

```js
const readStream = fs.createReadStream('bigfile.txt', 'utf-8');
readStream.on('data', (chunk) => console.log('읽는 중:', chunk));
```

**< 쓰기 스트림 >**

```js
const writeStream = fs.createWriteStream('output.txt');
writeStream.write('데이터 기록 중...\n');
writeStream.end('기록 완료');
```

스트림(stream)은 대용량 파일을 한 번에 다 읽지 않고,
조각(chunk) 단위로 나눠서 처리해 메모리 절약이 가능하다.

---

# 프로미스 기반 (fs/promises)

콜백 대신 async/await로 간단히 쓸 수 있다.

```js
import { readFile, writeFile } from 'fs/promises';

const text = await readFile('data.txt', 'utf-8');
await writeFile('copy.txt', text);
```

실무에서는 fs/promises 방식이 가장 깔끔하고 에러 처리도 쉽다.

---

# 실무 활용 예시

**< JSON 파일 읽기/쓰기 >**

```js
import { readFile, writeFile } from 'fs/promises';

const data = JSON.parse(await readFile('user.json', 'utf-8'));
data.lastLogin = new Date();
await writeFile('user.json', JSON.stringify(data, null, 2));
```

**< 로그 기록기 >**

```js
import fs from 'fs';
export function log(message) {
  const time = new Date().toISOString();
  fs.appendFileSync('app.log', `[${time}] ${message}\n`);
}
```
