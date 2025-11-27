# Node.js 외부 라이브러리 - morgan

_참고 사이트_
https://github.com/expressjs/morgan

---

# 1. 개요

morgan은 Express에서 HTTP 요청을 로깅(log) 해주는 외부 미들웨어다.
개발 환경에서는 콘솔에 요청 정보가 바로 찍혀서 디버깅이 쉬워지고,
운영 환경에서는 파일에 기록해 서버 상태를 추적하는 데 사용한다.

npm i morgan ✅ 설치 필요

---

# 2. 주요 역할

Express 프로젝트에서 가장 널리 사용되는 “로그 미들웨어”다.

- 요청 메서드(GET, POST…) 출력
- 요청 URL 표시
- 상태 코드(200, 404, 500 등) 출력
- 응답 시간(ms) 출력
- 로그 포맷 customizable
- 개발/운영 환경별 로그 분리 가능

---

# 3. 기본 사용법

**< 개발 환경 >**

```js
import morgan from 'morgan';
app.use(morgan('dev'));
```

- `'dev' 포맷`
  \_ 컬러 출력
  \_ 메서드 / URL / 상태코드 / 응답시간 출력
  \_ 개발에 최적화
  \_ 예시: GET /products 200 12.5 ms

---

# 4. 주요 포맷 종류

morgan은 여러 가지 미리 정의된 포맷을 제공한다.

**< dev >**
가장 많이 쓰고, 짧고 컬러풀하다.

```js
app.use(morgan('dev'));
```

**< combined >**
Apache 로그 스타일(운영 환경에서 많이 씀)

```js
app.use(morgan('combined'));
```

**< tiny >**
아주 간단한 출력만 원할 때

```js
app.use(morgan('tiny'));
```

**< common >**
표준적인 일반 로그

```js
app.use(morgan('common'));
```

---

# 5. 로그를 파일로 저장하기

운영 환경에서는 로그를 파일에 남기기도 한다.

```js
import fs from 'fs';
import path from 'path';
import morgan from 'morgan';

const logStream = fs.createWriteStream(path.join(process.cwd(), 'access.log'), {
  flags: 'a',
});

app.use(morgan('combined', { stream: logStream }));
```

- access.log 파일에 누적 저장
- 서버 상태 파악, 장애 분석에 유용

---

# 6. 커스텀 토큰 만들기

특정 정보를 로그에 추가하고 싶을 때 사용한다.

```js
morgan.token('host', (req) => req.hostname);

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :host')
);
```

---

# 7. morgan 위치 (실무 팁)

보통 다음 순서로 둔다.
요청이 들어오자마자 로그가 찍혀야 확실하기 때문에 항상 맨 위쪽에 둔다.

```js
app.use(morgan('dev')); // 1. 가장 위에
app.use(express.json()); // 2. JSON 파싱
app.use(cors()); // 3. CORS
app.use('/api', router); // 4. 라우터
app.use(errorHandler); // 5. 에러 핸들러
```

---

# 8. 자주 하는 실수

- morgan을 라우터 아래에 둬서 로그가 안 찍힘
- 운영 환경에서도 dev 포맷을 사용 (정보 부족)
- 파일 모드로 저장할 때 flags 누락해 log 덮어쓰기 발생
- JSON 파서보다 아래에 둬서 body 정보 확인이 어려움
