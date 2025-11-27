# Node.js 내장 모듈 — events

_참고 사이트_
https://nodejs.org/api/events.html

1️⃣ 개요

이벤트(Event) 기반 프로그래밍을 지원하는 Node.js의 핵심 모듈이다.
Node는 내부적으로 EventEmitter 패턴을 사용해 동작한다.
서버 요청, 파일 입출력, 스트림 데이터 등 거의 모든 게 이벤트로 이루어진다.

import EventEmitter from 'events'; ❌ 설치 불필요

2️⃣ 기본 구조

이벤트는 “발생(emitter)”과 “리스너(listener)”의 조합으로 작동한다.

```js
import EventEmitter from 'events';

const emitter = new EventEmitter();

// 리스너 등록
emitter.on('greet', (name) => {
  console.log(`안녕, ${name}!`);
});

// 이벤트 발생
emitter.emit('greet', '레온');
```

3️⃣ 주요 메서드

- `.on(event, listener)`: 이벤트 리스너 등록 (여러 개 가능)
- `.once(event, listener)`: 한 번만 실행되는 리스너 등록
- `.emit(event, [...args])`: 이벤트 발생시키기
- `.removeListener(event, listener)`: 특정 리스너 제거
- `.removeAllListeners([event])`: 이벤트 리스너 전체 제거
- `.listenerCount(event)`: 등록된 리스너 개수 반환
- `.eventNames()`: 등록된 이벤트 이름 배열 반환

4️⃣ 한 번만 실행되는 이벤트

.once()는 로그인 성공, 연결 완료 등 한 번만 발생해야 하는 이벤트에 유용하다.

```js
const emitter = new EventEmitter();

emitter.once('init', () => {
  console.log('초기화 완료 (한 번만 실행)');
});

emitter.emit('init');
emitter.emit('init');
```

5️⃣ 매개변수 전달

emit()으로 넘긴 인자는 리스너로 그대로 전달된다.

```js
emitter.on('login', (user, time) => {
  console.log(`${user}님이 ${time}에 로그인했습니다.`);
});

emitter.emit('login', '레온', '20:45');
```

6️⃣ 에러 이벤트 처리

Node의 이벤트 시스템에서 error 이벤트는 특별 취급된다.
리스너가 없는데 error 이벤트가 발생하면, 프로그램이 강제 종료된다.

```js
const emitter = new EventEmitter();

// 안전한 에러 처리
emitter.on('error', (err) => {
  console.error('이벤트 에러 발생:', err.message);
});

emitter.emit('error', new Error('DB 연결 실패'));
```

7️⃣ EventEmitter 상속 (실무 패턴)

서버나 모듈을 설계할 때, EventEmitter를 확장해서 커스텀 이벤트 시스템을 만든다.

```js
import EventEmitter from 'events';

class ChatServer extends EventEmitter {
  sendMessage(user, msg) {
    this.emit('message', { user, msg });
  }
}

const chat = new ChatServer();

chat.on('message', ({ user, msg }) => {
  console.log(`[${user}] ${msg}`);
});

chat.sendMessage('레온', 'Node.js 이벤트는 재밌다!');
```

8️⃣ 실무 응용 예시

**< 파일 업로드 진행률 >**

```js
emitter.on('progress', (percent) => {
  console.log(`업로드 진행률: ${percent}%`);
});

let percent = 0;
const timer = setInterval(() => {
  percent += 20;
  emitter.emit('progress', percent);
  if (percent === 100) clearInterval(timer);
}, 500);
```

**< HTTP 요청 이벤트 감지 >**
http.createServer()도 내부적으로 EventEmitter를 상속한다.
즉, server.on('request')는 단순한 콜백이 아니라 “이벤트 리스너 등록”이다.
http.Server 클래스가 EventEmitter를 상속하고 있기 때문이다.

```js
import http from 'http';

const server = http.createServer((req, res) => {
  res.end('Hello');
});

server.on('request', (req, res) => {
  console.log(`요청 수신: ${req.url}`);
});

server.listen(3000);
```

9️⃣ 이벤트 제거

이벤트 해제가 필요한 경우, 동일한 리스너 참조를 전달해야 한다.
익명 함수로 등록하면 제거가 불가능하므로, 항상 별도 함수로 등록하는 게 안전하다.

```js
function greet(name) {
  console.log(`안녕, ${name}`);
}

emitter.on('hi', greet);
emitter.removeListener('hi', greet);
```
