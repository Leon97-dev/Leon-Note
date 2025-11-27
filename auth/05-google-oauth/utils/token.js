// TODO) JWT: 토큰 발급/검증 유틸
// ?) AccessToken / RefreshToken 발급 & 검증만 담당하는 순수 함수 모듈
import jwt from 'jsonwebtoken';
import {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
} from '../config/constants.js';
// ^) constants.js에서 모든 환경값을 가져오도록 통합 관리

// ?) 토큰 발급
// *) AccessToken + RefreshToken 동시 발급
export function generateTokens(userId) {
  // ^) sub: 토큰 표준 필드 (“subject”, 사용자 고유 식별자)
  const accessToken = jwt.sign({ sub: userId }, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: '1h', // IMO) 개발 단계에서는 1h, 실 서비스는 10~30분 추천
  });

  const refreshToken = jwt.sign({ sub: userId }, JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: '1d', // IMO) 개발 1일, 실제 서비스는 7~14일 추천
  });

  return { accessToken, refreshToken };
}

// ?) Access Token 검증
export function verifyAccessToken(token) {
  const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
  return { userId: decoded.sub };
  // ^) 반환값을 통일 시키면 middleware 본문이 단순해짐
}

// ?) Refresh Token 검증
export function verifyRefreshToken(token) {
  const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
  return { userId: decoded.sub };
}

/**
 * &) 핵심 정리
 * *) 1. generateTokens(userId)
 * AccessToken / RefreshToken을 한 번에 생성하는 함수
 * DB 접근 없음 → 완전한 “순수 유틸”
 *
 * *) 2. verifyAccessToken(token)
 * Authorization 헤더 or 쿠키에서 가져온 access token 검증
 * payload.sub 를 userId 로 반환해주면 사용성이 매우 좋아짐
 *
 * *) 3. verifyRefreshToken(token)
 * refresh token 기반 재발급 로직에서 사용
 *
 * *) 4. utils로 둬야 하는 이유
 * - 비즈니스 로직 없음
 * - DB 호출 없음
 * - passport-local, passport-jwt, Google OAuth 등 어디서든 재사용 가능
 */
