// TODO) Error-Handler: 클래스 기반 에러 핸들러
// ?) 클래스 기반 에러 생성 + 전역 처리 로직 요약 설명
import { debugError } from './debug.js';

// &) Global Error Handling
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // 기본 Error의 message 설정
    this.statusCode = statusCode; // HTTP 상태 코드 저장 (400/401/404 등)
    this.isOperational = true; // ‘예상 가능한 에러’임을 표시
    this.path = null; // 유효성 에러 등에서 추가 정보 저장 용도

    // ?) 개발자가 만든 클래스 이름으로 stack trace 정리
    Error.captureStackTrace(this, this.constructor);
  }
}

// &) 404 에러 클래스
export class NotFoundError extends AppError {
  constructor(message = '리소스를 찾을 수 없습니다') {
    super(message, 404);
  }
}

// &) 401 에러 클래스
export class UnauthorizedError extends AppError {
  constructor(pathOrMessage, message = null) {
    if (message) {
      super(message, 401);
      this.path = pathOrMessage;
    } else {
      super(pathOrMessage || '비밀번호가 일치하지 않습니다', 401);
    }
  }
}

// &) 400 에러 클래스
export class ValidationError extends AppError {
  constructor(pathOrMessage, message = null) {
    if (message) {
      super(message, 400);
      this.path = pathOrMessage;
    } else {
      super(pathOrMessage || '입력 데이터가 올바르지 않습니다', 400);
    }
  }
}

// &) 409 에러 클래스
export class ConflictError extends AppError {
  constructor(message = '이미 존재하는 데이터입니다') {
    super(message, 409);
  }
}

// &) Global Error Handler (글로벌 에러 처리)
export const errorHandler = (err, req, res, next) => {
  debugError('에러 발생:', err);

  // *)1️. Prisma 에러 처리
  if (err.code === 'P2002') {
    return res.status(409).json({
      message: '이미 존재하는 데이터입니다',
      error: 'CONFLICT',
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      message: '리소스를 찾을 수 없습니다',
      error: 'NOT_FOUND',
    });
  }

  // *) 2️. Multer 에러 처리 (파일 업로드)
  if (err.name === 'MulterError') {
    return res.status(400).json({
      message: err.message,
      error: 'FILE_UPLOAD_ERROR',
    });
  }

  // *) 3️. 커스텀 에러 처리
  if (err.isOperational) {
    const errorType = err.constructor.name.replace('Error', '').toUpperCase();

    const response = {
      message: err.message,
      error: errorType,
    };

    if (err.path) {
      response.path = err.path;
    }

    return res.status(err.statusCode).json(response);
  }

  // *) 4️. 예상하지 못한 에러 처리 (기본값)
  const statusCode = err.statusCode || 500;
  const message = err.message || '서버 에러가 발생했습니다';

  res.status(statusCode).json({
    message,
    error: 'SERVER_ERROR',
  });
};

// &) 404 핸들러
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    message: '요청한 리소스를 찾을 수 없습니다',
    error: 'NOT_FOUND',
  });
};

/**
 * -------------------------------
 * [Error System: 클래스 기반 에러 관리 구조]
 * -------------------------------
 *
 * &) 목적
 * 서버에서 발생하는 다양한 에러(유효성 검사, 인증, DB 에러)를
 * 하나의 규격(AppError)으로 통일해서 관리하기 위함이다.
 * 이렇게 하면 컨트롤러·서비스 어디서든 같은 형태로 에러를 던지고,
 * error-handler.js에서 일관된 응답 형태로 변환할 수 있다.
 *
 * Express 기본 에러 처리는 단순하기 때문에,
 * 실제 서비스 운영 수준에서는 에러 타입을 더 세분화하고
 * "예측 가능한 에러 vs 시스템 에러"를 구별하는 체계가 필요하다.
 *
 * -------------------------------
 * [왜 클래스 기반 에러가 필요한가?]
 * -------------------------------
 *
 * 1) HTTP 상태 코드 + 에러 메시지 + 추가 정보(path)를 한 객체로 관리 가능
 * 2) isOperational 필드로 “예상된 오류”를 구분하여
 *    서버 내부 에러와 사용자 실수 에러를 분리 가능
 * 3) 서로 다른 파일에서 동일한 에러 형식을 유지하기 쉬움
 * 4) error-handler.js 하나에서 모든 에러를 통합적으로 처리할 수 있음
 *
 * AppError는 이 시스템의 ‘기준’ 역할을 수행한다.
 *
 * -------------------------------
 * [실무에서 자주 발생하는 문제들]
 * -------------------------------
 *
 * 1) Prisma 에러(P2002, P2025)처럼 코드 기반 에러가 따로 존재함
 * 2) Multer 파일 업로드 에러는 에러 타입이 다름
 * 3) 잘못된 입력 값 → ValidationError
 * 4) 로그인 실패 → UnauthorizedError
 * 5) 존재하지 않는 데이터 접근 → NotFoundError
 *
 * 이런 다양한 에러를 모두 통합하려면
 * 클래스 기반 구조가 가장 안정적인 선택이다.
 *
 * -------------------------------
 * [전역 에러 핸들러의 역할]
 * -------------------------------
 *
 * - Prisma 에러 → 409/404 등 맞는 상태 코드로 변환
 * - Multer 에러 → 파일 업로드 전용 에러 메시지
 * - AppError 기반 에러 → 예측 가능한 정상적 오류 처리
 * - 나머지 예상 못한 에러 → 500 SERVER_ERROR
 *
 * 즉, 서버의 모든 에러 흐름을 한 곳에서 정리해주는 “마지막 방어선”이다.
 *
 * -------------------------------
 * [정리]
 * -------------------------------
 * AppError(기준) + 개별 에러 클래스(확장) + 전역 에러 핸들러(처리)
 * 이 세 가지 조합이 서비스 레벨에서 가장 안정적인 에러 아키텍처다.
 * 지금 구성은 실제 회사 백엔드에서 쓰는 정석 설계와 동일한 구조다.
 */
