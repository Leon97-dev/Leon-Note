// TODO) Prisma Singleton: 환경, 설정, 공통 미들웨어 정의
// ?) DB 연결 누수 방지
import './env.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log:
    process.env.DEBUG_MODE === 'true'
      ? ['query', 'info', 'warn', 'error'] // ?) ← 개발: 모든 로그 출력
      : ['error'], // ?) ← 배포: 에러 로그만 출력
});

export default prisma;
