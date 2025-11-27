# Axios — HTTP 요청 클라이언트

_참고 사이트_
https://axios-http.com/

---

# 1. 개요

Axios는 브라우저·Node.js 어디서나 사용할 수 있는 Promise 기반 HTTP 클라이언트다.
네트워크 요청을 더 직관적으로 보내고, 응답 데이터를 자동으로 파싱하며,
에러 구조도 통일되어서 다루기 편하다.

npm i axios ✅ 설치 필요

---

# 2. 주요 역할

프론트(NEXT.js), 백엔드(Node.js), 서버 간 통신 모두 사용 가능

- HTTP 요청(GET, POST, PUT, PATCH, DELETE) 전송
- JSON 자동 파싱
- 요청/응답 인터셉터(interceptor)
- 공통 설정(baseURL)
- 헤더 설정
- 타임아웃 관리
- 쿠키/인증 정보 포함 가능
- 브라우저와 Node.js 모두 지원

---

# 3. 기본 사용법

**< GET 요청 >**

```js
import axios from 'axios';

const res = await axios.get('https://api.example.com/products');
console.log(res.data);
```

**< POST 요청 >**

```js
await axios.post('/login', {
  email: 'test@test.com',
  password: '1234',
});
```

---

# 4. Axios 인스턴스(실무에서 가장 많이 사용)

반복되는 설정을 공통으로 묶을 수 있다.

```js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
});

// 사용
const res = await api.get('/products');
```

---

# 5. 요청/응답 인터셉터

**< 요청 인터셉터 >**

```js
api.interceptors.request.use((config) => {
  console.log('Request:', config.url);
  return config;
});
```

**< 응답 인터셉터 >**

```js
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API Error:', err.message);
    return Promise.reject(err);
  }
);
```

---

# 6. 헤더 설정

```js
await api.get('/admin', {
  headers: { Authorization: `Bearer ${token}` },
});
```

---

# 7. 쿠키/세션 포함

브라우저에서 요청 시 서버에서도 사용 가능하다.

```js
axios.get('/me', {
  withCredentials: true,
});
```

---

# 8. 에러 처리 구조

Axios 에러는 항상 동일한 구조를 가진다.

```js
try {
  await api.get('/wrong');
} catch (err) {
  console.log(err.response.status);
  console.log(err.response.data);
}
```

---

# 9. Axios vs fetch

- `Axios`
  \_ JSON 자동 파싱: ⭕️
  \_ 인터셉터: ⭕️
  \_ baseURL: ⭕️
  \_ 타임아웃: ⭕️
  \_ 에러 처리: 일관됨
  \_ 사용 난이도: 쉬움

- `fetch`
  \_ JSON 자동 파싱: ❌ (직접 res.json() 호출)
  \_ 인터셉터: ❌
  \_ baseURL: ❌
  \_ 타임아웃: ❌ (직접 AbortController 구현)
  \_ 에러 처리: 상태코드 400/500도 “성공”으로 들어옴
  \_ 사용 난이도: 약간 번거로움

**백엔드/풀스택에서는 Axios를 더 많이 사용한다.**
