// TODO) Create-Error: 공용 HTTP 에러 생성 유틸
// ?) 간단하게 HTTP 에러 객체를 만들고 싶을 때 사용하는 “함수 기반 에러 팩토리”
export function createError(
  statusCode = 500,
  message = '서버 에러',
  path = null
) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true; // *) 글로벌 에러 핸들러에서 구분할 수 있도록 표시

  // ?) Validation 에러 등 특정 필드 위치가 필요한 경우
  if (path) {
    error.path = path;
  }

  return error;
}

/**
 * &) 현재 프로젝트에서 사용하지 않는 이유
 * 이 프로젝트는 이미 “클래스 기반 에러 시스템(AppError 등)”을 사용 중이다.
 * → NotFoundError, ValidationError, UnauthorizedError 같은 구조
 * 그래서 createError()는 지금 구조에서는 중복되는 기능이라 사용하지 않는다.
 *
 * &) 그러나 이 함수가 유용한 경우
 * 상황 1) 클래스 기반이 너무 무겁다고 느껴질 때
 * 상황 2) API 규모가 작아서 간단한 함수 에러 시스템이 더 적합할 때
 * 상황 3) http-errors 같은 외부 패키지 없이 빠르게 에러 생성이 필요할 때
 * 상황 4) 모노레포 환경에서 “공통 에러 팩토리”로 재사용할 때
 *
 * 즉, 현재는 비활성화 상태지만
 * 필요 시 언제든 가져다 사용할 수 있는 범용적인 에러 팩토리 유틸이다.
 */
