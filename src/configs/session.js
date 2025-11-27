// TODO) Session:  환경, 설정, 공통 미들웨어 정의
// ?) 세션을 DB와 연결하고 쿠키 정책을 통합 관리하는 전역 설정 모듈
import './env.js';
import session from 'express-session';
import pg from 'pg';
import connectPgSimple from 'connect-pg-simple';

/**
 * &) 모듈 설치 필요
 * npm i express-session
 * npm i pg
 * npm i connect-pg-simple
 */

// ?) 세션을 디비에 연결하는 상수 (고정)
const PgSession = connectPgSimple(session);

// ?) DB에 session 연결 함수
export const sessionMiddleware = session({
  store: new PgSession({
    pool: new pg.Pool({
      // ^) pg.Pool() → Postgres 연결 풀
      connectionString: process.env.SESSION_STORE_URL,
    }), // ^) 개인정보 민감하니 env 세션 스토어 필수!
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
 * -------------------------------
 * [Session: 서버 인증 상태 관리 설정]
 * -------------------------------
 *
 * &) 목적
 * 세션(Session)은 로그인한 사용자의 인증 상태를 서버가 보관하는 방식이다.
 * 서버가 발급한 세션 ID(sid)를 쿠키로 저장하고,
 * 사용자가 다시 요청할 때 이 쿠키를 보내면
 * 서버는 DB에 저장된 세션 정보로 사용자를 식별한다.
 *
 * 이 시스템을 안전하게 사용하려면
 * 세션 저장소(DB), 쿠키 정책, 암호 키, 환경 변수 등이 모두 필요하다.
 * 그래서 세션 설정은 라우터나 서비스가 아닌
 * config 폴더에서 중앙집중적으로 관리해야 한다.
 *
 * -------------------------------
 * [실무에서 자주 발생하는 세션 문제들]
 * -------------------------------
 *
 * 1) 메모리 세션(default) 사용
 *    → 서버 재시작마다 로그인 전부 날아감
 *    → 확장성·안정성 모두 떨어져 운영 불가
 *
 * 2) 세션을 라우터/서비스 내부에서 초기화
 *    → 요청마다 새로운 세션 스토어 생성
 *    → 성능 저하 + DB 커넥션 폭주
 *
 * 3) 쿠키 secure / sameSite 설정 실수
 *    → 로컬에서는 잘 되는데 배포하면 로그인 유지가 안 됨
 *    → HTTPS 정책과 연동 문제
 *
 * 4) SESSION_SECRET 노출 또는 미지정
 *    → 세션 변조 위험
 *
 * 5) 테이블 자동 생성 설정 누락
 *    → 배포 환경에서는 user_sessions 테이블이 없어서
 *      로그인 자체가 동작 안 되는 문제 발생
 *
 * -------------------------------
 * [왜 Session을 config에서 관리해야 하는가?]
 * -------------------------------
 * - 세션은 "환경 의존성"이 거의 모든 요소를 차지한다.
 *   (DB URL, SECRET, NODE_ENV, 쿠키 옵션 등)
 * - 실제 비즈니스 로직이 아니라 “인증 인프라 설정”에 가깝다.
 * - 앱 전체가 공통으로 사용하는 전역 미들웨어라
 *   config에서 초기화해야 구조가 깔끔하고 버그 가능성이 줄어든다.
 * - 개발/운영 환경에 따라 정책(sameSite, secure)을 자동 분리할 수 있다.
 *
 * -------------------------------
 * [정리]
 * -------------------------------
 * 세션 설정은 단순 미들웨어가 아니라
 * 환경 구성 + 인증 정책 + 스토리지 관리가 합쳐진 핵심 시스템이다.
 * 따라서 config/session.js 같은 전용 파일에서
 * 단일 책임으로 설정하는 것이 실무에서도 가장 안정적이다.
 */
