// TODO) Env 로더: 환경, 설정, 공통 미들웨어 정의
// ?) 모든 모듈에서 .env를 확실하게 읽도록 공용 로더 제공
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// *) 프로젝트 루트의 .env를 절대 경로로 로드
dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

// ?) 필수 환경변수 검사 (세션 기반)
const sessionStoreUrl = process.env.SESSION_STORE_URL;
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionStoreUrl) {
  throw new Error(
    "SESSION_STORE_URL이 설정되지 않았습니다. .env를 확인하세요."
  );
}

if (!sessionSecret) {
  throw new Error("SESSION_SECRET이 설정되지 않았습니다. .env를 확인하세요.");
}

// ?) env 객체: 애플리케이션 전역에서 사용하는 환경 변수
export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 3000),

  // ?) DB
  dbUrl: process.env.DATABASE_URL,

  // ?) Session
  sessionStoreUrl,
  sessionSecret,

  // ?) JWT (세션 프로젝트라도 필요하면 사용 가능)
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpires: process.env.JWT_ACCESS_EXPIRES ?? "15m",
    refreshExpires: process.env.JWT_REFRESH_EXPIRES ?? "7d",
  },
};
