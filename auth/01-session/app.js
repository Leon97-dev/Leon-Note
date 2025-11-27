// TODO) App: 서버 진입점
// !) 공용 env 로더 (다른 모듈보다 먼저 실행)
import './config/env.js';
import express from 'express';
import cors from 'cors';

// &) 환경변수
const PORT = process.env.PORT || 3000;

// &) Error Import
import { debugLog } from './core/error/debug.js';
import { errorHandler, notFoundHandler } from './core/error/error-handler.js';

// &) Auth Import
import cookieParser from 'cookie-parser';
import { sessionMiddleware } from './config/session.js';

// &) Route Import
import healthRoutes from './routes/health-routes.js';
import userRoutes from './routes/user-routes.js';

// ?) express 앱 생성
const app = express();

// ?) CORS 설정
app.use(cors());

// ?) 미들웨어

app.use(express.json());
app.use(cookieParser());
app.use(sessionMiddleware);

// ?) 라우터 등록 (핵심)
app.use('/health', healthRoutes); // 헬스 체크
app.use('/users', userRoutes); // 유저

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
