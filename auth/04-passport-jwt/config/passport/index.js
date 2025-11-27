// TODO) Passport: 초기 설정 로직
// ?) JWT 전략 등록 및 passport 인스턴스 준비
import passport from 'passport';
import { setupJwtStrategy } from './strategies/jwt.js';

/**
 * &) setupPassport()
 * 서버 시작 시 한 번 실행되는 초기화 함수
 * passport.use()로 JWT 전략을 등록하고,
 * Express 앱에서 passport.initialize()로 사용할 passport 인스턴스를 반환한다.
 *
 * &) JWT 전략 등록
 * - jwtFromRequest: Authorization 헤더에서 Bearer 토큰 추출
 * - secretOrKey: ACCESS_SECRET 이용해 서명 검증
 * - payload.id 기반으로 DB에서 유저 조회 → req.user 주입
 *
 * &) passport 인스턴스 반환
 * app.js에서 app.use(passport.initialize())로 연결됨
 * 모든 라우터에서 passport.authenticate('jwt') 사용 가능
 */

// ?) 전략 등록
export function setupPassport() {
  setupJwtStrategy();
  return passport;
}

/**
 * &) 핵심 요약
 * *) 1. setupPassport()
 * JWT 전략을 passport에 등록한다.
 * passport 인스턴스를 Express가 사용할 수 있게 반환한다.
 *
 * *) 2. app.use(passport.initialize())
 * 매 요청마다 Passport 기능(req.user, passport.authenticate 등)을 활성화한다.
 *
 * *) 3. passport.authenticate('jwt')
 * JWT 전략 실행 → 토큰 검증 → req.user 자동 주입
 *
 * 구조적으로:
 * strategies/jwt.js → 전략 정의
 * config/passport/index.js → 전략 등록 + passport 초기 준비
 * app.js → passport.initialize()로 Passport 사용 가능하게 설정
 */
