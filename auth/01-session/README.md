# 세션(Session) 기반 인증 기본 개념

세션(Session)은 서버가 직접 로그인 상태를 기억하는 방식이다.
JWT가 “토큰을 클라이언트에게 맡기는” 무상태(stateless) 구조라면,
세션은 “서버가 직접 로그인 정보를 저장하는” 유상태(stateful) 구조다.

---

# 1. 기본 동작 흐름

**< 로그인 요청 >**

- 사용자가 /login 으로 이메일/비밀번호를 전송한다.
- 서버는 비밀번호를 검증 후, 세션 저장소(DB나 메모리 등)에 사용자 정보를 기록한다.
- 서버는 브라우저에 세션 ID(sid)가 담긴 쿠키를 전송한다.
- Set-Cookie: sid=abc123; HttpOnly

**< 인증된 요청 >**

- 이후 사용자가 /me 같은 보호된 API를 요청할 때 브라우저는 자동으로 sid 쿠키를 함께 전송한다.
- 서버는 쿠키 속 sid를 확인해 세션 저장소에서 로그인 정보를 찾는다.
- 세션이 존재하면 인증 성공 → req.session.userId로 접근 가능.

**< 로그아웃 >**

- 사용자가 로그아웃하면, 서버는 세션 저장소에서 해당 세션을 삭제한다.
- 쿠키도 동시에 만료(res.clearCookie('sid')).

---

# 2. 핵심 구성요소

- 세션 ID (sid): 사용자를 식별하는 고유 키. 쿠키로 클라이언트에 전달됨
- 세션 저장소(Store): 세션 데이터를 보관하는 공간. (메모리, Redis, PostgreSQL 등)
- 쿠키 (Cookie): 브라우저가 서버 세션을 식별하기 위해 보유하는 값
- req.session: Express에서 로그인 정보 저장 및 조회하는 객체

---

# 3. Session vs JWT 차이

- `Session`
  \_ 저장 위치: 서버 (DB/메모리)
  \_ 상태 관리: 유상태 (stateful)
  \_ 확장성: 서버 확장 시 세션 공유 필요
  \_ 보안성: 서버가 직접 관리 (유효기간 제어 쉬움)
  \_ 적합한 경우: 웹사이트 로그인 (예: 쇼핑몰, 커뮤니티)

- `JWT`
  \_ 저장 위치: 클라이언트 (로컬/쿠키)
  \_ 상태 관리: 무상태 (stateless)
  \_ 확장성: 서버 간 공유 필요 없음
  \_ 보안성: 탈취 시 만료 전까지 유효
  \_ 적합한 경우: 모바일 앱, 분산 API 서버

---

# 4. 세션의 장점과 단점

- [장점]
  \_ 서버가 직접 로그인 상태를 관리 → 보안적 제어가 쉬움
  \_ 토큰 조작 위험이 낮음
  \_ 쿠키 기반이라 자동 인증이 편리함

- [단점]
  \_ 서버 확장 시 세션 동기화 필요
  \_ 서버에 세션 저장 공간이 필요함 (메모리나 DB)
  \_ 클라이언트-서버 간 상태 유지 필요 → stateless 아키텍처와 상충

---

# 5. Express에서의 세션 작동 구조

0. [로그인 요청]
   ↓
1. 서버에서 세션 생성
   req.session.userId = user.id
   ↓
2. DB(user_sessions 테이블)에 저장
   sid → { userId: 1, expiresAt: ... }
   ↓
3. 브라우저에 쿠키 전송
   Set-Cookie: sid=abc123
   ↓
4. 이후 요청 시 자동 전송
   Cookie: sid=abc123
   ↓
5. 서버가 DB에서 세션 확인 후 req.session 복원

---

# 6. 세션 인증과 필수인 패키지

**< pg >**
PostgreSQL의 Node.js 공식 클라이언트 라이브러리
즉, Node 서버에서 Postgres DB에 접근할 수 있도록 해주는 드라이버다.
우리가 prisma로 ORM을 쓰듯, pg는 SQL을 직접 다룰 때 필요한 로우레벨 데이터베이스 연결 도구다.
connect-pg-simple 내부에서도 실제 DB 접근은 pg를 통해 일어난다.

```js
import pg from 'pg';
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
```

이렇게 하면 PostgreSQL 연결 풀(Pool)을 만들어서 여러 세션이 동시에 접근 가능하게 한다.

**< connect-pg-simple >**
Express 세션을 Postgres에 저장하도록 도와주는 세션 스토어 어댑터
기본적으로 express-session은 메모리에 세션을 저장하지만, 메모리는 서버 재시작 시 다 날아가는 단점이 있다.
그래서 세션을 DB에 영구 저장하기 위해 connect-pg-simple을 사용하는 것이다.
내부적으로 pg를 이용해 user_sessions 같은 테이블을 자동으로 생성하고 관리해준다.

```js
const PgSession = connectPgSimple(session);
store: new PgSession({
  pool: new pg.Pool({ connectionString: process.env.DATABASE_URL }),
  tableName: 'user_sessions',
});
```

이 구문 덕분에 세션이 DB에 저장되고, 서버가 재시작돼도 로그인 상태가 유지된다.

---

# 세션 인증은 완료했는데, 인가도 구현해야함 프로덕트 모델을 이용해서 할 예정
