// TODO) JWT Strategy: Access/Refresh 토큰 검증 로직
// ?) 쿠키에서 토큰을 꺼내어 인증하는 Passport-JWT 전략
import { Strategy as JwtStrategy } from 'passport-jwt';
import prisma from '../../prisma.js';

import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
} from '../../constants.js';

// ? JWT Access Token 옵션
// *) 요청(req)의 쿠키에서 AccessToken을 추출 → 검증 시 사용
const accessTokenOptions = {
  jwtFromRequest: (req) => req.cookies[ACCESS_TOKEN_COOKIE_NAME],
  secretOrKey: JWT_ACCESS_TOKEN_SECRET,
};

// ?) JWT Refresh Token 옵션
// *) RefreshToken도 마찬가지로 쿠키에서 추출
const refreshTokenOptions = {
  jwtFromRequest: (req) => req.cookies[REFRESH_TOKEN_COOKIE_NAME],
  secretOrKey: JWT_REFRESH_TOKEN_SECRET,
};

// ?) 공통 Verify Callback
// *) JWT 서명을 검증한 후 payload.sub에 담긴 userId로 DB 조회
async function jwtVerify(payload, done) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      // ?) 토큰은 유효하지만 유저는 삭제된 경우
      return done(null, false);
    }

    // ?) 인증 성공 → req.user에 user 객체 주입
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}

// ?) AccessToken Strategy
// *) AccessToken 검증 → 인증 보호된 API에서 사용
export const accessTokenStrategy = new JwtStrategy(
  accessTokenOptions,
  jwtVerify
);

// ?) RefreshToken Strategy
// *) RefreshToken 검증 → 토큰 재발급 엔드포인트에서 사용
export const refreshTokenStrategy = new JwtStrategy(
  refreshTokenOptions,
  jwtVerify
);

/**
 * &) 핵심 흐름
 * 1. jwtFromRequest → 쿠키에서 토큰 추출
 * 2. secretOrKey → JWT 서명 검증
 * 3. jwtVerify(payload) → payload.sub로 DB 조회
 * 4. user가 있으면 인증 성공, 없으면 실패
 *
 * ~) 장점
 * - Access / Refresh 기능 분리 → 보안 강화
 * - jwtVerify를 재사용 → 코드 유지보수 쉬움
 * - 쿠키 기반 인증이므로 XSS 위험 낮음
 *
 * ~) 주의
 * - 쿠키 설정에서 httpOnly/secure/sameSite 옵션 반드시 관리
 * - JWT_SECRET이 .env에서 반드시 존재해야 함
 */
