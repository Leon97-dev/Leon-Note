# Helmet — Express 보안 헤더 설정 미들웨어

_참고 사이트_
https://helmetjs.github.io/

---

# 1. 개요

Helmet은 Express에서 보안 관련 HTTP 헤더를 자동으로 설정해주는 미들웨어다.
웹 공격(XSS, 클릭재킹, MIME 타입 스니핑 등)을 기본적으로 막아주기 때문에,
운영 환경에서 거의 필수로 사용된다.

npm i helmet ✅ 설치 필요

---

# 2. 주요 역할

Express 서버의 보안 기본 설정을 한 번에 적용해준다.

- 보안 관련 헤더 자동 설정
- XSS 공격 방지
- 클릭재킹(clickjacking) 방지
- MIME 타입 위조 방지
- HSTS(HTTPS 강제) 설정
- Referrer Policy 관리
- 프론트, 백 모두 적용 가능 (Node 서버일 때)

---

# 3. 기본 사용법

```js
import helmet from 'helmet';
app.use(helmet());
```

이렇게 하면 Helmet의 대부분의 권장 보안 헤더가 자동으로 활성화된다.

---

# 4. Helmet이 설정하는 대표 헤더들

Helmet은 다양한 보안 헤더를 자동으로 켠다.

- Content-Security-Policy
- X-DNS-Prefetch-Control
- X-Frame-Options
- X-XSS-Protection
- Strict-Transport-Security (HSTS)
- X-Content-Type-Options
- Referrer-Policy

각 헤더는 브라우저의 특정 보안 취약점을 방어한다.

---

# 5. 옵션 사용

Helmet은 모든 기능을 켜고 끌 수 있다.

**< CSP(Content Security Policy) 직접 설정 >**

```js
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", 'https:'],
    },
  })
);
```

**< 프레임 보호(x-frame-options) 끄기 >**

```js
app.use(
  helmet({
    frameguard: false,
  })
);
```

**< referrer-policy 설정 >**

```js
app.use(
  helmet.referrerPolicy({
    policy: 'no-referrer',
  })
);
```

---

# 6. 개발 환경에서 조심할 점

- CSP가 브라우저 콘솔 에러를 일으킬 수 있음
  (특히 Next.js, React Development Script 실행 시)
- 필요하면 일부 헤더를 끄고 작업해도 됨

```js
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
```

---

# 7. Express에서의 권장 적용 순서

Helmet은 가능한 한 “가장 위쪽”에서 실행하는 것이 좋다.

```js
app.use(helmet()); // 1. 보안 헤더
app.use(cors()); // 2. CORS
app.use(morgan('dev')); // 3. 로깅
app.use(express.json()); // 4. 파서
// ...
```

---

# 8. Helmet이 보호하는 공격 예시

- 스크립트 삽입(XSS)
- 외부 iframe 악성 페이지 클릭유도(clickjacking)
- MIME 타입 스니핑
- HTTPS 강제(hsts)
- Referrer 정보 유출 방지

특히 프론트엔드와 API를 함께 배포할 때 매우 유용하다.
