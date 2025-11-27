// TODO) Passport 초기화: 모든 인증 전략(registration)을 한 곳에서 관리
// ?) Local / JWT / OAuth 전략 각각을 passport.use()로 등록하는 중앙 허브 역할
import passport from 'passport';
import prisma from '../prisma.js';

// &) 전략들 Import
import { localStrategy } from './strategies/local-strategy.js';
import {
  accessTokenStrategy,
  refreshTokenStrategy,
} from './strategies/jwt-strategy.js';
import { googleStrategy } from './strategies/google.js';

// &) Passport Strategy 등록

// ?) Local 로그인 (이메일 + 비밀번호)
passport.use('local', localStrategy);

// ?) JWT Access Token 인증 (API 보호용)
passport.use('access-token', accessTokenStrategy);

// ?) JWT Refresh Token 인증 (토큰 재발급용)
passport.use('refresh-token', refreshTokenStrategy);

// ?) Google OAuth2 인증
passport.use('google', googleStrategy);

// &) Session 기반 인증일 때만 호출되는 부분
// *) OAuth 또는 Local 로그인 완료 후 → 사용자 정보를 세션에 저장/복원

/**
 * ?) serializeUser
 * 사용자가 로그인 성공했을 때 딱 1번 호출됨
 * user 객체에서 세션에 저장할 "값 하나"를 선택해야 함 → 보통 user.id
 */
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

/**
 * ?) deserializeUser
 * 이후 모든 요청에서 세션의 userId를 DB에서 다시 조회하여 req.user에 주입
 */
passport.deserializeUser(async function (id, done) {
  const user = await prisma.user.findUnique({ where: { id } });
  done(null, user);
});

/**
 * &) passport 객체를 그대로 export
 * app.js에서 app.use(passport.initialize()) 로 초기화해서 사용
 * Session 방식일 경우 app.use(passport.session()) 도 함께 필요
 */

export default passport;
