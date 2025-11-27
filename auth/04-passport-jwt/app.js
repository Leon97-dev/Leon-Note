// TODO) App: 서버 진입점
// !) 공용 env 로더 (다른 모듈보다 먼저 실행)
import './config/env.js';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// &) 환경변수
const PORT = process.env.PORT || 3000;

// &) Route Import
import healthRoutes from './routes/health-routes.js';
import userRoutes from './routes/user-routes.js';

// &) Error Import
import { debugLog } from './core/error/debug.js';
import { errorHandler, notFoundHandler } from './core/error/error-handler.js';

// &) Auth Import
import { setupPassport } from './config/passport/index.js';

// ?) Passport 인스턴스 초기화 (전략 등록)
const passport = setupPassport();

// ?) express 앱 생성
const app = express();

// ?) CORS 설정
app.use(cors());
app.use(cookieParser());

// ?) 미들웨어
app.use(express.json());
app.use(passport.initialize());

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

/**
 * &) Passport: initialize()의 역할
 * *) 1. passport.initialize()
 * 모든 요청(req)에 Passport 기능을 주입한다.
 * req.login, req.user, passport.authenticate() 등을 사용할 수 있게 준비한다.
 *
 * *) 2. JWT 방식에서도 필수
 * 세션을 쓰지 않아도 initialize()는 반드시 한 번 호출해야 함.
 * 이게 없으면 requireAuth(passport.authenticate())가 동작하지 않는다.
 *
 * *) 3. 요청마다 Passport 상태 초기화
 * 매 요청마다 인증 상태를 새로 세팅할 수 있게 환경을 리셋한다.
 *
 * *) 4. 전역 미들웨어로 등록해야 하는 이유
 * app.use(passport.initialize())를 서버 시작 시 한 번 등록해두면,
 * 모든 라우터(/users, /auth 등)에서 passport.authenticate('jwt') 사용 가능.
 */
