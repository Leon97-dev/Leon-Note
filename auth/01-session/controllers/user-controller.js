// TODO) User-Controller: 요청 처리 (응답 처리)
// ?) 유저 Con 요청 후 -> 유저 Ser에서 실제 처리
import asyncHandler from '../core/error/async-handler.js';
import {
  registerUser,
  loginUser,
  getMe,
  changeNickname,
  changePassword,
  deleteAccount,
} from '../services/user-service.js';

// ?) 회원가입
export const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  const user = await registerUser({
    email,
    password,
    name,
  });

  // ?) 자동 로그인
  req.session.userId = user.id;

  // ?) 응답
  res.status(201).json({
    success: true,
    message: '회원가입 완료',
    data: {
      userId: user.id,
      email: user.email,
      name: user.name,
    },
  });
});

// ?) 로그인
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await loginUser(email, password);

  // ?) 로그인 유지
  req.session.userId = user.id;

  // ?) 응답
  res.status(200).json({
    success: true,
    message: '로그인 성공',
    userId: user.id,
    email: user.email,
    name: user.name,
  });
});

// ?) 내 정보 조회
export const me = asyncHandler(async (req, res) => {
  const user = await getMe(req.session.userId);

  // ?) 응답
  res.status(200).json({
    success: true,
    message: '인증 성공',
    data: user,
  });
});

// ?) 로그아웃
export const logout = asyncHandler(async (req, res) => {
  req.session.destroy(() => {
    // ^) DB에 저장된 세션을 삭제
    res.clearCookie('sid');
    // ^) 브라우저의 쿠키도 삭제
    // ^) 쿠키 삭제 안하면 서버는 없는데 브라우저는 있으니, 인증이 꼬이니 주의!
    // ?) 응답
    res.status(200).json({
      success: true,
      message: '로그아웃 완료',
    });
  });
});

// ?) 닉네임 변경
export const updateName = asyncHandler(async (req, res) => {
  const userId = req.session.userId;
  const { name } = req.body;

  const updated = await changeNickname(userId, name);

  // ?) 응답
  res.status(200).json({
    success: true,
    message: '닉네임이 변경되었습니다',
    data: updated,
  });
});

// ?) 비밀번호 변경
export const updatePassword = asyncHandler(async (req, res) => {
  const userId = req.session.userId;
  const { oldPw, newPw } = req.body;

  await changePassword(userId, oldPw, newPw);

  // ?) 응답
  res.status(200).json({
    success: true,
    message: '비밀번호가 변경되었습니다',
  });
});

// ?) 계정 삭제
export const removeAccount = asyncHandler(async (req, res) => {
  const userId = req.session.userId;

  await deleteAccount(userId);

  // ?) 응답
  req.session.destroy(() => {
    res.clearCookie('sid');
    res.status(200).json({
      success: true,
      message: '계정이 삭제되었습니다',
    });
  });
});

// !) 확장하면 로직 추가해야함

/**
 * &) req.session.userId = user.id;
 * *) 세션에 다음 정보를 저장한다.
 * 1. 세션 ID(sid) ← 쿠키에 저장
 * 2. 세션 데이터 ← { userId: 123 }
 * 3. 회원가입 직후 브라우저 쿠키에 sid=랜덤값 저장
 * 4. 서버 세션스토어(PostgreSQL)에는 { userId: 유저ID } 저장
 * 5. 이렇게 해서 자동 로그인 상태가 된다.
 * ?) 회원가입 직후 로그인 유지하는 이유
 * 웹 서비스 대부분이 이렇게 동작하고 다시 로그인 페이지로 이동시키지 않아 귀찮은 짓을 없앤다.
 * 단, 실제로는 로그인 페이지로 넘어가는 사이트들이 많으니 선택 사항임
 *
 * &) GET /me는 “로그인한 유저의 정보”를 가져오는 표준 API이다.
 * 프론트 UI에서 로그인 상태 유지, 프로필 표시, 메뉴 렌더링에 꼭 필요하다.
 * *) 프론트엔드는 로컬에 userId를 저장하지 않는다.
 * 그래서 페이지가 새로고침되면 로그인 상태인지 아닌지 구분을 못한다.
 * *) 프론트는 세션 쿠키를 직접 볼 수 없다.
 * 쿠키는 httpOnly이기 때문에 프론트 JS가 읽을 수 없기에 반드시 서버에 물어봐야 한다.
 * *) 프론트 상단 네비게이션바(헤더)에서 프로필 표시
 * 로그인 상태이면, 이름 표시, 이메일 표시, “로그아웃” 버튼 보이기
 * 로그인 안 했으면, “로그인 / 회원가입” 버튼 보이기
 * 이걸 구현하기 위해 /me를 쓴다.
 * *) 대부분의 웹/앱 서비스가 /me를 사용
 * GitHub, Google, Instagram, Discord 등등 현대 프론트엔드 구조에서는 필수 API다.
 * *) 세션(Session), JWT, OAuth 등등 /me(또는 GET /user) API는 모두 공통적으로 필수다.
 */
