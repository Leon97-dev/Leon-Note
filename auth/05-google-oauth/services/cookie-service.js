// TODO) Cookie-Service: 토큰 쿠키 관리 계층
// ?) 인증 과정에서 Access/Refresh 토큰을 안전하게 설정·삭제하는 순수 유틸 모듈
import {
  NODE_ENV,
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from '../config/constants.js';

// ?) 토큰 쿠키 설정
export function setTokenCookies(res, accessToken, refreshToken) {
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    maxAge: 1 * 60 * 60 * 1000, // 1 hour
  });

  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/auth/refresh',
  });
}

// ?) 토큰 쿠키 제거
export function clearTokenCookies(res) {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, { path: '/auth/refresh' });
}
