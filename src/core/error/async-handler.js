// TODO) Async-Handler: 비동기 라우터 에러 자동 처리 래퍼
// ?) Express 비동기 컨트롤러에서 발생하는 에러를 자동으로 next(err)로 전달하는 헬퍼

const asyncHandler = (fn) => (req, res, next) => {
  // fn(req, res, next)가 Promise이므로 자동으로 resolve/catch 가능
  Promise.resolve(fn(req, res, next)).catch(next);
  // catch(next) → 오류 발생 시 Express 에러 핸들러로 넘김
};

export default asyncHandler;

/**
 * -------------------------------
 * [Async-Handler: 비동기 전용 에러 자동 처리 래퍼]
 * -------------------------------
 *
 * &) 목적
 * Express는 기본적으로 “동기 함수”에서 발생한 에러만 자동으로 처리한다.
 * 하지만 비동기 함수(async/await, Promise) 내부에서 발생한 에러는
 * try/catch로 감싸지 않으면 Express가 감지하지 못한다.
 * async-handler는 이러한 비동기 에러를 자동으로 next(err)로 전달하여
 * 모든 컨트롤러에서 중복되는 try/catch 코드를 제거하는 역할을 한다.
 *
 * -------------------------------
 * [왜 필요한가?]
 * -------------------------------
 *
 * 1) Express 기본 구조의 한계
 *    - 동기 에러는 자동 처리
 *    - 비동기 에러는 자동으로 잡지 못함
 *
 * 2) try/catch 남발
 *    - 모든 라우터마다 동일한 패턴 반복
 *    - 코드가 복잡하고 가독성 떨어짐
 *
 * 3) UnhandledPromiseRejection 위험
 *    - async 내부 에러를 잡지 못하면
 *      서버가 죽거나 경고 발생
 *
 * asyncHandler는 이 문제를 해결하여
 * 비동기 함수에서 발생하는 모든 에러를 안전하게 next(err)로 전달한다.
 *
 * -------------------------------
 * [실무에서 자주 발생하는 문제들]
 * -------------------------------
 *
 * 1) 서비스 로직에서 throw된 에러가 try/catch로 감싸지 않음
 *    → Express가 처리 불가 → 서버 중단
 *
 * 2) 컨트롤러마다 try/catch 반복
 *    → 유지보수 어려움, 코드 중복 심각
 *
 * 3) Prisma, API 호출, 파일 처리 등은 모두 async
 *    → async-handler가 없으면 에러 전파 누락 위험
 *
 * -------------------------------
 * [asyncHandler의 효과]
 * -------------------------------
 *
 * - 모든 비동기 라우터를 자동으로 에러 안전 구역에 넣는다
 * - 에러는 전부 글로벌 error-handler.js에서 처리
 * - 컨트롤러는 비즈니스 로직만 작성하면 됨
 * - API 코드가 깔끔하고 유지보수 쉬워짐
 *
 * 즉, asyncHandler는 “비동기 전용 안전망” 역할을 한다.
 *
 * -------------------------------
 * [사용 예시]
 * -------------------------------
 *
 * ~) before: try/catch가 반복됨 (복잡함)
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
 * asyncHandler를 쓰면 컨트롤러는 간결해지고,
 * 에러 처리는 모두 전역 에러 핸들러에 맡길 수 있다.
 */
