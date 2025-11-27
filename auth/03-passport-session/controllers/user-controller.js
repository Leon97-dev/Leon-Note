// TODO) User-Controller: 요청 처리 (응답 처리)
// ?) 유저 Con 요청 후 -> 유저 Ser에서 실제 처리
import asyncHandler from "../core/error/async-handler.js";
import {
  registerUser,
  loginUser,
  getMe,
  changeNickname,
  changePassword,
  deleteAccount,
} from "../services/user-service.js";

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
    message: "회원가입 완료",
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
    message: "로그인 성공",
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
    message: "인증 성공",
    data: user,
  });
});

// ?) 로그아웃
export const logout = asyncHandler(async (req, res) => {
  req.session.destroy(() => {
    // ^) DB에 저장된 세션을 삭제
    res.clearCookie("sid");
    // ^) 브라우저의 쿠키도 삭제
    // ^) 쿠키 삭제 안하면 서버는 없는데 브라우저는 있으니, 인증이 꼬이니 주의!
    // ?) 응답
    res.status(200).json({
      success: true,
      message: "로그아웃 완료",
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
    message: "닉네임이 변경되었습니다",
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
    message: "비밀번호가 변경되었습니다",
  });
});

// ?) 계정 삭제
export const removeAccount = asyncHandler(async (req, res) => {
  const userId = req.session.userId;

  await deleteAccount(userId);

  // ?) 응답
  req.session.destroy(() => {
    res.clearCookie("sid");
    res.status(200).json({
      success: true,
      message: "계정이 삭제되었습니다",
    });
  });
});

// !) 확장하면 로직 추가해야함
