# compression — HTTP 응답 압축 미들웨어

_참고 사이트_
https://github.com/expressjs/compression

---

# 1. 개요

compression은 Express에서 HTTP 응답을 gzip/deflate 방식으로 압축해주는 미들웨어다.
클라이언트(브라우저/앱)로 전달되는 데이터 크기를 줄여 네트워크 속도를 개선한다.

npm i compression ✅ 설치 필요

---

# 2. 주요 역할

특히 JSON 응답 덩치가 큰 API라면 체감 성능 차이가 꽤 크다.

- 응답 데이터를 gzip 또는 deflate로 자동 압축
- 전송 데이터 크기를 크게 줄여줌
- API 속도 향상
- 모바일 네트워크 환경에서 유리
- CDN/Reverse Proxy와 함께 사용하면 더 효과적

---

# 3. 기본 사용법

```js
import compression from 'compression';
import express from 'express';

const app = express();

app.use(compression());
```

이제 Express의 모든 응답은 자동으로 압축된다.

---

# 4. 옵션 사용

**< 최소 압축 크기 지정 (default: 1KB) >**

```js
app.use(
  compression({
    threshold: 1024, // 1KB 이상만 압축
  })
);
```

**< 압축 수준 설정 >**

```js
app.use(
  compression({
    level: 6, // 0~9 (높을수록 CPU 사용 ↑, 압축률 ↑)
  })
);
```

**< 특정 라우트만 압축 제외 >**

```js
app.get('/no-compress', (req, res) => {
  res.set('x-no-compression', true);
  res.send('압축 안 함');
});

// 라우트 조건을 커스텀하려면 filter() 활용
app.use(
  compression({
    filter(req, res) {
      return !req.headers['x-no-compression'];
    },
  })
);
```

---

# 5. 압축이 적용되는 방식

브라우저는 자동으로 다음 헤더를 보낸다.

```makefile
Accept-Encoding: gzip, deflate, br
```

compression은 클라이언트가 지원하는 방식 중 가장 효율적인 방식으로 응답을 압축해 전달한다.

서버 응답은 다음처럼 헤더가 붙는다.

```css
content-encoding: gzip;
```

클라이언트는 압축을 자동으로 풀어서 렌더링한다.

---

# 6. 실무 팁

- JSON 응답이 큰 API일 때 특히 효과 있음
- 이미지/영상 파일엔 의미 없음 (이미 압축되어 있음)
- reverse proxy(Nginx)가 있으면 서버·프록시 중 한 쪽만 압축하도록 설정
- 압축은 CPU를 사용하므로 트래픽 큰 서비스면 레벨 낮추는 게 좋음
