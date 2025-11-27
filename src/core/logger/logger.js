// TODO) Logger: Winston 기반 전역 로거 (콘솔 + 일별 파일 로테이션)
// ?) 개발/운영 어디서든 안정적으로 사용 가능
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

/**
 * &) 모듈 설치 필요
 * npm i winston
 * npm i winston-daily-rotate-file
 */

// ?) 공통 포맷 (타임스탬프 + 메시지 + 스택 추적)
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }), // 에러 스택 자동 포함
  winston.format.printf((info) => {
    return `[${info.timestamp}] ${info.level.toUpperCase()} — ${info.message}`;
  })
);

// ?) 실제 logger 인스턴스 생성
const logger = winston.createLogger({
  level: 'info', // 운영에서는 info 이상만 출력
  format: logFormat, // 공통 포맷 적용
  transports: [
    // *) 콘솔 출력 (개발: debug / 운영: info)
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: winston.format.combine(winston.format.colorize(), logFormat), // 개발용 색상 출력
    }),

    // ? error.log (에러만 저장)
    new DailyRotateFile({
      level: 'error',
      dirname: 'logs',
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d', // 최근 14일만 보관
      zippedArchive: false,
      format: logFormat,
    }),

    // ?) combined.log (전체 로그 기록)
    new DailyRotateFile({
      level: 'info',
      dirname: 'logs',
      filename: 'combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      zippedArchive: false,
      format: logFormat,
    }),
  ],
});

// ?) 개발 환경에서는 debug 레벨 활성화
if (process.env.NODE_ENV !== 'production') {
  logger.level = 'debug';
}

export default logger;

/**
 * -------------------------------
 * [Logger: 서버 전역 로깅 시스템]
 * -------------------------------
 *
 * &) 목적
 * 서비스 운영 중 발생하는 모든 로그(요청, 오류, 시스템 이벤트)를
 * 안정적이고 일관된 방식으로 기록하기 위한 전역 로거이다.
 *
 * 콘솔 출력뿐 아니라 날짜별 파일 로테이션(일별 로그 파일 생성)까지 지원해
 * 개발 환경과 운영 환경 모두에서 활용할 수 있는 실무용 구조다.
 *
 * -------------------------------
 * [왜 Winston인가?]
 * -------------------------------
 *
 * 1) 다양한 출력 방식 지원 (Console, File, Cloud 등)
 * 2) 일별 파일 회전(DailyRotateFile)로 로그 관리 자동화
 * 3) 에러 스택 추적(stack) 자동 기록 가능
 * 4) 운영/개발 환경에 따른 로그 레벨 분리 용이
 *
 * Node.js Logger 중 가장 실무에서 널리 쓰이는 조합이다.
 *
 * -------------------------------
 * [실무에서 자주 발생하는 문제들]
 * -------------------------------
 *
 * 1) console.log만 사용 → 배포 환경에서 로그 누락 / 정리 불가
 * 2) 로그가 쌓여도 삭제·관리 시스템이 없음 → 서버 저장 공간 증가
 * 3) 에러 스택을 남기지 않아 디버깅 어려움
 * 4) 운영 환경과 개발 환경에서 다른 로그 레벨을 설정하기 어려움
 *
 * Winston + DailyRotateFile 조합은 이런 문제를 모두 해결한다.
 *
 * -------------------------------
 * [현재 구성의 핵심 포인트]
 * -------------------------------
 *
 * - Console 로그 + 파일 로그 병행
 * - error.log: 에러만 저장
 * - combined.log: 정보/경고/에러 전체 저장
 * - logs/ 폴더에 날짜별 파일이 생성됨
 * - 운영(production)에서는 info 이상만 출력
 * - 개발 환경에서는 debug 레벨까지 출력
 * - timestamp + message + stack까지 출력하는 포맷 적용
 *
 * -------------------------------
 * [정리]
 * -------------------------------
 *
 * 이 로거는 서비스 규모가 커져도 충분히 버티는 “전역 로깅 시스템”이다.
 * 오류 추적, API 분석, 모니터링 등 모든 운영 환경에 유용하며,
 * Node.js 백엔드 실무에서 가장 널리 활용되는 표준 구조다.
 */
