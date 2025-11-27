// TODO) Response: 공용 응답 포맷 유틸
// ?) 컨트롤러에서 응답 형태를 통일하고 싶을 때 사용하는 “순수 함수 모음”
// *) 현재 프로젝트에서는 사용하지 않지만, 확장 시 재사용 가능하도록 유지

// ?) 성공 응답 포맷
export function success(message = 'Success', data = null, status = 200) {
  /**
   * &) 기본 구조
   * ok: 성공 여부 (true)
   * status: HTTP 상태 코드
   * message: 요청 성공 메시지
   * data: 선택적 데이터 페이로드
   *
   * 컨트롤러에서 다음처럼 사용 가능:
   * return res.status(200).json(success('로그인 성공', user));
   */
  const body = { ok: true, status, message };

  // ?) data가 존재할 때만 포함 (null이면 응답 최소화)
  if (data !== null && data !== undefined) {
    body.data = data;
  }

  return body;
}

// ?) 실패 응답 포맷
export function fail(message = 'Error', status = 400, errors = null) {
  /**
   * &) 기본 구조
   * ok: 실패(false)
   * status: HTTP 상태 코드
   * message: 실패 이유
   * errors: 필드 단위 에러 정보 등 세부 오류
   *
   * 예시:
   * return res.status(400).json(fail('입력값 오류', 400, { email: '형식 오류' }));
   */
  const body = { ok: false, status, message };

  // ?) errors가 있을 때만 포함
  if (errors) {
    body.errors = errors;
  }

  return body;
}

/**
 * ?) 언제 사용하는 유틸인가?
 * 현재 구조에서는 컨트롤러에서 직접 JSON 응답을 작성하고,
 * 에러는 글로벌 에러 핸들러(error-handler.js)에서 통일된 형태로 처리한다.
 *
 * 그래서 지금은 사용하지 않지만,
 * 아래 상황에서 매우 유용해진다:
 *
 * 1. 프론트엔드와 “API 응답 구조 통일”을 강하게 약속해야 할 때
 * 2. 모든 컨트롤러를 success()/fail() 한 줄로 간결하게 쓰고 싶을 때
 * 3. 다국어 메시지 처리(i18n)로 확장하고 싶을 때
 * 4. GraphQL/REST 혼합 환경에서 응답 포맷 관리가 필요할 때
 *
 * 결론적으로 response.js는 “확장성을 위한 유틸리티”이고
 * 지금 구조를 해치지 않으면서 미래 확장에 대비하는 파일이다.
 */
