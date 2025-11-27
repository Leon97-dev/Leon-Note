// TODO) Async-Handler: 비동기 라우터 에러 자동 처리 래퍼
// ?) Express 비동기 컨트롤러에서 발생하는 에러를 자동으로 next(err)로 전달하는 헬퍼

/**
 * &) 왜 필요한가?
 * Express는 기본적으로 “동기 함수”에서 throw된 에러만 자동으로 잡아서 next(err)로 넘겨준다.
 * ?) 하지만 비동기 함수(async/await, Promise) 안에서 에러가 발생하면?
 * try/catch를 안 쓰면 Express는 에러를 감지하지 못한다.
 * 결과: 서버가 죽거나, UnhandledPromiseRejection 경고 발생
 *
 * 그래서 asyncHandler는 비동기 컨트롤러를 감싸서:
 * - 에러가 발생하면 자동으로 next(err) 호출
 * - 모든 비동기 라우터에서 try/catch 필요 없음
 *
 * *) 즉, 코드 중복을 없애는 비동기 전용 안전 래퍼다.
 */

const asyncHandler = (fn) => (req, res, next) => {
  // *) fn(req, res, next)가 Promise이므로 자동으로 resolve/catch 가능
  // *) catch(next) → 오류 발생 시 Express 에러 핸들러로 넘김
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;

/**
 * &) 사용 예시
 * ~) before: try/catch가 반복됨 (지저분)
 * router.get('/users', async (req, res, next) => {
 *   try {
 *     const users = await getUsers();
 *     res.json(users);
 *   } catch (err) {
 *     next(err);
 *   }
 * });
 *
 * ~) after: 깔끔하게 사용 가능
 * router.get('/users', asyncHandler(async (req, res) => {
 *   const users = await getUsers();
 *   res.json(users);
 * }));
 *
 * asyncHandler를 쓰면 컨트롤러가 훨씬 간결해지고
 * 에러는 모두 글로벌 에러 핸들러(error-handler.js)에서 관리된다.
 */
