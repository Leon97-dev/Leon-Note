// TODO) Auth-Service: 비즈니스 로직
// ?) JWT 발급/검증 로직
import jwt from 'jsonwebtoken';
import {
  setUserRefreshToken,
  clearUserRefreshToken,
} from '../repositories/user-repository.js';

// ?) 환경변수 주입
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// ?) 만료 시간 기본값 설정
const ACCESS_EXPIRES_IN = process.env.ACCESS_EXPIRES_IN ?? '1h';
const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN ?? '14d';

// ?) AccessToken 생성 (짧은 수명)
export function signAccessToken(payload) {
  // ^) payload -> 토큰 안에 담을 사용자 정보 (보통 id, email 등)
  return jwt.sign(payload, ACCESS_SECRET, {
    // ^) jwt.sign() -> JWT 토큰을 새로 발급하는 함수
    expiresIn: ACCESS_EXPIRES_IN,
  });
}

// ?) RefreshToken 생성 (긴 수명)
export function signRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });
}

// ?) AccessToken 검증
export function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
  // ^) jwt.verify() -> “이 토큰이 진짜 서버가 발급한 게 맞는지”를 검증함
  // ^) 만료되었거나 위조된 토큰이면 에러를 던진다
}

// ?) RefreshToken 검증
export function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

// ?) 토큰 묶어서 발급 (회원가입/로그인 시)
export async function generateTokens(user) {
  const accessToken = signAccessToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const refreshToken = signRefreshToken({
    id: user.id,
    email: user.email,
  });

  // ?) DB에 refreshToken 저장
  await setUserRefreshToken(user.id, refreshToken);

  return { accessToken, refreshToken };
}

// ?) refreshToken 기반으로 AccessToken 재발급
export async function rotateAccessToken(refreshToken) {
  const decoded = verifyRefreshToken(refreshToken);

  const accessToken = signAccessToken({
    id: decoded.id,
    email: decoded.email,
    role: decoded.role,
  });

  return accessToken;
}

// ?) refreshToken 삭제 (로그아웃)
export async function clearRefreshToken(userId) {
  return clearUserRefreshToken(userId);
}

/**
 * &) 역할 정리
 * signAccessToken  →  로그인 시 짧은 인증 토큰 발급
 * signRefreshToken →  재발급 용 토큰, DB 저장 필요
 * verifyAccessToken  →  requireAuth 미들웨어에서 사용
 * verifyRefreshToken →  refresh 로직에서 유효성과 만료 여부 판정
 *
 * 즉, JWT “순수 기능”만 담당하고 있으며,
 * 비즈니스 로직(토큰 저장/삭제, 재발급 판단)은 user-service 또는 controller에서 처리한다.
 *
 * &) 4개 환경변수
 * *) JWT_ACCESS_SECRET
 * 역할: Access Token을 서명할 비밀키(Secret Key)
 * 필수 여부: 필수
 * 기본값 여부: 없음
 * *) JWT_REFRESH_SECRET
 * 역할: Refresh Token을 서명할 비밀키(Secret Key)
 * 필수 여부: 필수
 * 기본값 여부: 없음
 * *) ACCESS_EXPIRES_IN
 * 역할: Access Token의 유효기간
 * 필수 여부: 선택
 * 기본값 여부: 있음
 * *) REFRESH_EXPIRES_IN
 * 역할: Refresh Token의 유효기간
 * 필수 여부: 선택
 * 기본값 여부: 있음
 *
 * 앞의 두 개(secret) → 없으면 절대 작동 안 함
 * 뒤의 두 개(expires) → 안 써도 기본값으로 동작 가능
 *
 * &) JWT_ACCESS_SECRET & JWT_REFRESH_SECRET
 * 서버가 JWT를 발급할 때,
 * 토큰이 진짜 서버가 만든 게 맞는지 증명하기 위해 서명(Signature)을 붙이는데 그때 사용함
 * 서버는 이 비밀키로 토큰을 서명하고, 클라이언트가 다시 보낼 때 서버는 같은 키로 검증하는 구조다.
 * Access Token은 수명이 짧고 자주 쓰이니까,
 * 보안 사고에 대비해 Refresh용 키를 따로 쓰는 게 일반적이다.
 *
 * &) ACCESS_EXPIRES_IN & REFRESH_EXPIRES_IN
 * jsonwebtoken.sign() 함수에 넘기는 옵션 중 expiresIn 값으로 들어간다.
 * 1h → 1시간, 14d → 14일, 7d → 일주일, 3600 → 3600초 (숫자도 가능)
 *
 * &) “change-this-to-a-long-random-string”
 * 그냥 예시용 placeholder다.
 * 대 실제 서비스에서는 저걸 그대로 쓰면 안 된다.
 * 그래서 직접 긴 랜덤 문자열로 바꿔야한다.
 *
 * @example
 * JWT_ACCESS_SECRET=ajsdH1ns9f91ns01jsmA09ms2l!@#asjd
 * JWT_REFRESH_SECRET=B28x!0@asdlkm102jN98DsmS##ncm2
 *
 * 이런식으로 복잡할수록 좋다.
 * 이 secret 값이 유출되면, 누구나 JWT를 “위조”해서 서버 인증을 통과할 수 있다.
 */
