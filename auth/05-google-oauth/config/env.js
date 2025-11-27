// TODO) Env Loader: 환경 설정 공용 로더
// ?) 모든 모듈에서 .env를 자동으로 읽도록 초기화
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// *) 프로젝트 루트의 .env를 절대 경로로 로드
dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});

// &) OAuth 환경 변수 검증

// ?) Google OAuth (필수)
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!googleClientId || !googleClientSecret) {
  throw new Error(
    'Google OAuth 환경변수가 설정되지 않았습니다. .env에서 GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET을 확인하세요.'
  );
}

// &) 공용 환경 객체

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',

  // ?) 서버 포트
  port: Number(process.env.PORT ?? 3000),

  // ?) Google OAuth 설정
  google: {
    clientId: googleClientId,
    clientSecret: googleClientSecret,
    callbackURL:
      process.env.GOOGLE_CALLBACK_URL ??
      'http://localhost:3000/auth/google/callback', // 기본값 제공
  },

  // ?) 필요할 경우 사용 (세션 방식)
  session: {
    secret: process.env.SESSION_SECRET ?? 'change-this-secret',
    storeUrl: process.env.SESSION_STORE_URL ?? null, // OAuth는 선택 사항
  },
};
