// TODO) Constants: 환경 변수 + 전역 상수 관리
// ?) 애플리케이션 전체에서 공통으로 사용하는 값들을 한 곳에서 관리

import dotenv from 'dotenv';

// ?) .env 로드
dotenv.config();
// ^) 어떤 모듈이 가장 먼저 실행되든 환경 변수가 보장되도록 초기 로드

// &) 서버/환경 설정 (공통)
// ?) 실행 환경 (development / production / test)
const NODE_ENV = process.env.NODE_ENV || 'development';

// ?) 서버 포트
const PORT = process.env.PORT || 3000;

// ?) JWT 설정
// *) AccessToken / RefreshToken 서명 검증용 비밀키
const JWT_ACCESS_TOKEN_SECRET =
  process.env.JWT_ACCESS_TOKEN_SECRET || 'your_jwt_access_token_secret';

const JWT_REFRESH_TOKEN_SECRET =
  process.env.JWT_REFRESH_TOKEN_SECRET || 'your_jwt_refresh_token_secret';

// ?) Cookie (JWT 인증용 쿠키 이름)
const ACCESS_TOKEN_COOKIE_NAME = 'access-token'; // AccessToken 저장 쿠키
const REFRESH_TOKEN_COOKIE_NAME = 'refresh-token'; // RefreshToken 저장 쿠키

// ?) Google OAuth 설정
// *) Google 인증 전용 Client ID / Secret
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

/**
 * &) Google OAuth 주요 설명
 * 1. clientId / clientSecret 은 Google Cloud Console에서 발급됨
 * 2. 외부 로그인 페이지로 이동할 때 clientId 필요
 * 3. callback 단계에서 token 교환할 때 clientSecret 필요
 * 4. 반드시 .env 로 관리해야 함 (절대 공개 금지)
 */

// ?) Export: 모든 상수를 외부에서 가져다 쓰도록 내보냄
export {
  NODE_ENV,
  PORT,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
};
