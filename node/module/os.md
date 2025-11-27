# Node.js 내장 모듈 — os

_참고 사이트_
https://nodejs.org/api/os.html

1️⃣ 개요

운영체제의 기본 정보와 시스템 리소스를 조회하는 Node.js 내장 모듈이다.
서버 환경에 따라 코드 동작을 달리하거나, 로그 기록에 환경 정보를 포함시킬 때 자주 사용된다.

import fs from 'fs'; ❌ 설치 불필요

2️⃣ 주요 역할

- 운영체제 종류, 버전, 아키텍처 확인
- CPU, 메모리, 네트워크 상태 조회
- 현재 사용자 정보 가져오기
- OS별 줄바꿈 문자(EOL) 확인

3️⃣ 시스템 정보 조회

**< os.type() >**
운영체제 종류를 반환한다.

```js
console.log(os.type());
// 예: 'Linux', 'Darwin', 'Windows_NT'
```

**< os.platform() >**
플랫폼 식별 문자열을 반환한다.

```js
console.log(os.platform());
// 예: 'linux', 'darwin', 'win32'
```

**< os.release() >**
운영체제 버전 문자열을 반환한다.

```js
console.log(os.release());
// 예: '23.5.0'
```

**< os.arch() >**
CPU 아키텍처 확인 (64비트, ARM 등)

```js
console.log(os.arch());
// 예: 'x64', 'arm64'
```

4️⃣ 메모리 관련

**< os.totalmem() >**
총 메모리 용량 (byte 단위)

```js
console.log((os.totalmem() / 1024 ** 3).toFixed(2) + ' GB');
```

**< os.freemem() >**
사용 가능한 메모리 용량

```js
console.log((os.freemem() / 1024 ** 3).toFixed(2) + ' GB');
```

5️⃣ CPU 관련

**< os.cpus() >**
CPU 코어별 정보 (모델명, 속도, 사용량 등)

```js
console.log(os.cpus()[0]);
// {
//   model: 'Apple M3',
//   speed: 3200,
//   times: { user: 150000, nice: 0, sys: 120000, idle: 420000, irq: 0 }
// }
```

**< os.cpus().length >**
CPU 코어 개수 확인 (멀티스레드 풀 설정에 자주 사용됨)

```js
console.log('코어 개수:', os.cpus().length);
```

6️⃣ 네트워크 관련

**< os.networkInterfaces() >**
네트워크 인터페이스 정보 (IP 주소 포함)
IP 기반 로깅이나 내부망 서비스 식별 시 사용한다.

```js
console.log(os.networkInterfaces());
```

7️⃣ 사용자 정보

**< os.userInfo() >**
현재 로그인한 사용자 정보

```js
console.log(os.userInfo());
// {
//   uid: 501,
//   username: 'leon',
//   homedir: '/Users/leon',
//   shell: '/bin/zsh'
// }
```

8️⃣ 경로 및 환경 관련

**< 폴더 생성 >**

**< os.homedir() >**
현재 사용자의 홈 디렉터리

```js
console.log(os.homedir());
// 예: /Users/leon
```

**< os.tmpdir() >**
임시 파일 저장소 경로

```js
console.log(os.tmpdir());
// 예: /var/folders/abc123/T/
```

9️⃣ 기타 유틸

- `os.hostname()`: 컴퓨터 이름(호스트명)
  \_ my-macbook.local

- `os.uptime()`: 시스템 부팅 후 경과 시간(초)
  \_ 123456

- `os.endianness()`: CPU 엔디안
  \_ 'LE' 또는 'BE'

- `os.EOL`: 줄바꿈 문자
  \_ \n (Mac/Linux), \r\n (Windows)

🔟 실무 활용 예시

**< 서버 실행 시 환경 로그 출력 >**

```js
import os from 'os';

console.log('==========================');
console.log(`OS: ${os.type()} (${os.platform()} ${os.release()})`);
console.log(`CPU: ${os.cpus().length} cores`);
console.log(`Memory: ${(os.totalmem() / 1024 ** 3).toFixed(1)} GB`);
console.log(`Host: ${os.hostname()}`);
console.log('==========================');
```

**< 사용자 홈 디렉터리에 파일 저장 >**

```js
import fs from 'fs';
import path from 'path';
import os from 'os';

const savePath = path.join(os.homedir(), 'myapp', 'config.json');
fs.writeFileSync(savePath, JSON.stringify({ user: 'Leon' }));
```
