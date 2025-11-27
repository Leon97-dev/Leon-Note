// TODO) Session:  환경, 설정, 공통 미들웨어 정의
import './env.js';
import session from 'express-session';
import pg from 'pg';
import connectPgSimple from 'connect-pg-simple';

// ?) 세션을 디비에 연결하는 상수 (고정)
const PgSession = connectPgSimple(session);

// ?) DB에 session 연결 함수
export const sessionMiddleware = session({
  store: new PgSession({
    pool: new pg.Pool({
      // ^) pg.Pool() → Postgres 연결 풀
      connectionString: process.env.SESSION_STORE_URL,
    }), // ^) 개인정보 민감하니 env 필수!
    tableName: 'user_sessions', // 세션이 저장될 테이블 이름
    createTableIfMissing: true, // 테이블 없으면 자동 생성
  }),
  name: 'sid', // 쿠키 이름을 sid로 지정
  secret: process.env.SESSION_SECRET || 'change-this-in-.env',
  resave: false, // 요청마다 세션 무조건 재저장 안 함
  saveUninitialized: false, // 빈 세션을 저장하지 않음 → GDPR/보안 기준에 적합
  // ^) resave / saveUninitialized 둘 다 현재 Express에서 추천하는 기본 설정
  cookie: {
    httpOnly: true, // JS로 쿠키 접근 불가 (XSS 방어)
    secure: process.env.NODE_ENV === 'production', // HTTPS 환경에서만 쿠키 전송
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    // ^) 개발(lax) / 배포(none) 구분
    maxAge: 1000 * 60 * 60 * 24 * 7, // 세션 쿠키 만료 7일 (거의 고정)
  },
});

/**
 * &) 모듈 설치 필요
 * import session from 'express-session';
 * import pg from 'pg';
 * import connectPgSimple from 'connect-pg-simple';
 *
 * ?) config 폴더에 세션 설정을 분리한 이유
 * 세션 코드는 애플리케이션의 로직이 아니라 “환경/설정”이기 때문이다.
 * 세션 미들웨어는 다음과 같은 성질을 가진다.
 *
 * *) 1. “환경 의존성”이 크다
 * DB 연결 정보, SESSION_SECRET, NODE_ENV, 쿠키 정책, 테이블 이름
 * 이런 값들은 상황(dev/stage/prod)에 따라 바뀐다.
 * 즉 비즈니스 코드가 아니라 환경 구성(Config)이다.
 * 그래서 실제 기능 코드와 한 파일에 섞여 있으면 관리 난이도만 올라간다.
 * *) 2. 재사용 목적
 * *) 3. 미들웨어 폴더 보다 더 명확함
 */
