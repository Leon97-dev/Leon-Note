# Node.js 외부 라이브러리 - CORS

_참고 사이트_
https://github.com/expressjs/cors

# 1. 개요

CORS(Cross-Origin Resource Sharing)는
브라우저가 다른 도메인(Origin)에 요청을 보낼 때 발생하는 보안 정책이다.
서버가 특정 Origin을 허용해줘야만 브라우저가 요청을 정상적으로 보낼 수 있다.
Express 서버에서 이 정책을 쉽게 제어하기 위해 사용하는 외부 미들웨어가 cors 패키지다.

npm i cors ✅ 설치 필요

# 2. 주요 역할

- 브라우저의 Cross-Origin 요청 허용
- 허용할 Origin, Method, Header 제어
- 인증 정보(쿠키) 포함 여부 설정
- Preflight(OPTIONS) 요청 자동 처리

# 3. 사용법 기본 형태

```js
import cors from 'cors';

app.use(cors());
```

이렇게 쓰면 모든 Origin에 대해 허용하는 가장 기본 설정이 된다.

# 4. 옵션 설정

**< 특정 Origin만 허용 >**

```js
app.use(
  cors({
    origin: 'https://my-frontend.com',
  })
);
```

**< 여러 Origin 허용 >**

```js
const allowed = ['http://localhost:3000', 'https://myapp.com'];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
  })
);
```

**< 쿠키 / 인증정보 포함 >**

```js
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
```

브라우저 요청에서도 반드시 설정 필요

```js
fetch(url, { credentials: 'include' });
```

# 5. Preflight 요청 처리

브라우저는 민감한 요청(POST, PUT, DELETE 등)을 보내기 전에,
미리 OPTIONS 요청을 보내는데, cors 미들웨어가 자동으로 처리해준다.

```js
app.options('*', cors());
```

대부분 자동 처리되므로 별도 작성 필요 없음

# 6. 자주 하는 실수

- 서버만 credentials: true 설정하고, 브라우저 fetch에서 credentials를 설정하지 않음
- origin: true 를 origin 배열과 함께 잘못 섞어 사용
- 로컬 개발에서 포트만 달라도 Origin이 달라진다는 사실을 잊음
- proxy 환경에서 Origin이 재작성되는 경우 허용이 안 되어 403 발생
