// TODO) App: 서버 진입점
// !) 공용 env 로더 (다른 모듈보다 먼저 실행)
import './config/env.js';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// &) 환경변수
const PORT = process.env.PORT || 3000;

// &) Passport 초기화
// *) 모든 OAuth/JWT/Local 전략을 불러오고 passport 인스턴스를 반환
import passport from './config/passport/index.js';

// &) Route Import
import healthRoutes from './routes/health-routes.js';
import authRoutes from './routes/auth-routes.js';

// &) Error Import
import { debugLog } from './core/error/debug.js';
import { errorHandler, notFoundHandler } from './core/error/error-handler.js';

// ?) express 앱 생성
const app = express();

// ?) CORS 설정
// *) OAuth Redirect 대비: 크로스 도메인, 쿠키 허용
app.use(
  cors({
    origin: 'http://localhost:3000', // 필요 시 프론트 주소로 교체
    credentials: true, // 쿠키 허용
  })
);

// ?) Cookie Parser
// *) JWT 쿠키(access/refresh)를 읽기 위해 필수!
app.use(cookieParser());

// ?) JSON 파싱
app.use(express.json());

// ?) Passport 초기화
// *) 모든 요청에서 passport 전략 사용 가능
app.use(passport.initialize());

// ?) 라우터 등록 (핵심)
app.use('/health', healthRoutes); // 헬스 체크
app.use('/auth', authRoutes); // 인증

// ?) 기본 루트
app.get('/', (req, res) => {
  res.json({
    message: 'API 서버가 동작 중입니다. /health 또는 /auth 경로를 사용하세요.',
  });
});

// ?) 404 핸들러
app.use(notFoundHandler);

// ?) 전역 에러 핸들러
app.use(errorHandler);

// ?) 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port http://localhost:${PORT}`);
  debugLog('Debug mode is enabled');
  debugLog(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
