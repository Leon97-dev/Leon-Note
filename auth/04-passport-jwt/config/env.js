// TODO) Env 로더: 환경, 설정, 공통 미들웨어 정의
// ?) 모든 모듈에서 .env를 확실하게 읽도록 공용 로더 제공
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// *) 프로젝트 루트의 .env를 절대 경로로 로드
dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});

// ?) 애플리케이션에서 공통으로 참조할 환경 변수 객체
const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

// *) 필수 값 누락 시 빠르게 알리기 위해 에러를 던진다
if (!jwtAccessSecret || !jwtRefreshSecret) {
  throw new Error('JWT 비밀키가 설정되지 않았습니다. .env에서 JWT_ACCESS_SECRET, JWT_REFRESH_SECRET을 확인하세요.');
}

export const env = {
  jwt: {
    accessSecret: jwtAccessSecret,
    refreshSecret: jwtRefreshSecret,
    accessExpires: process.env.ACCESS_EXPIRES_IN ?? '1h',
    refreshExpires: process.env.REFRESH_EXPIRES_IN ?? '14d',
  },
};
