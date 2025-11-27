// TODO) User-Service: 비즈니스 로직
// ?) 유저 관련 예외 처리 후 -> 유저 Repo로 리턴
import asyncHandler from '../core/error/async-handler.js';
import { ValidationError } from '../core/error/error-handler.js';
import {
  registerUser,
  loginUser,
  getMe,
  changeNickname,
  changePassword,
  deleteAccount,
  changeUserRole,
  listUsers as listUsersService,
} from '../services/user-service.js';
import {
  generateTokens,
  rotateAccessToken,
  clearRefreshToken,
} from '../services/auth-service.js';

// ?) 회원가입
export const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;
  const user = await registerUser({
    email,
    password,
    name,
  });

  // ?) 토큰 주입
  const tokens = await await generateTokens(user);

  // ?) 응답
  res.status(201).json({
    success: true,
    message: '회원가입 완료',
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      ...tokens,
    },
  });
});

// ?) 로그인
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await loginUser(email, password);

  // ?) 토큰 주입
  const tokens = await generateTokens(user);

  // ?) 응답
  res.status(200).json({
    success: true,
    message: '로그인 성공',
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      ...tokens,
    },
  });
});

// ?) AccessToken 재발급
export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  // ?) 리프레쉬 존재 확인 후 엑세스 주입
  const accessToken = await rotateAccessToken(refreshToken);

  // ?) 응답
  res.status(200).json({
    success: true,
    message: '토큰 재발급 성공',
    accessToken,
  });
});

// ?) 로그아웃
export const logout = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  // ?) 리프레쉬 제거
  await clearRefreshToken(userId);

  // ?) 응답
  res.clearCookie('refreshToken');
  // ^) 쿠키도 같이 제거 해야함!
  res.status(200).json({
    success: true,
    message: '로그아웃 완료',
  });
});

// ?) 내 정보 조회
export const me = asyncHandler(async (req, res) => {
  const user = await getMe(req.user.id);

  // ?) 응답
  res.status(200).json({
    success: true,
    message: '인증 성공',
    data: user,
  });
});

// ?) 닉네임 변경
export const updateName = asyncHandler(async (req, res) => {
  const changeName = await changeNickname(req.user.id, req.body.name);

  // ?) 응답
  res.status(200).json({
    success: true,
    message: '닉네임이 변경되었습니다',
    data: changeName,
  });
});

// ?) 비밀번호 변경
export const updatePassword = asyncHandler(async (req, res) => {
  await changePassword(req.user.id, req.body.oldPw, req.body.newPw);

  // ?) 응답
  res.status(200).json({
    success: true,
    message: '비밀번호가 변경되었습니다',
  });
});

// ?) 계정 삭제
export const removeAccount = asyncHandler(async (req, res) => {
  await deleteAccount(req.user.id);

  // ?) 응답
  res.status(200).json({
    success: true,
    message: '계정이 삭제되었습니다',
  });
});

// ?) 관리자: 유저 역할 변경
export const updateUserRole = asyncHandler(async (req, res) => {
  const targetId = Number(req.params.id);
  if (Number.isNaN(targetId)) {
    throw new ValidationError('id', '유효한 사용자 ID가 아닙니다');
  }

  const updatedUser = await changeUserRole(targetId, req.body.role);

  res.status(200).json({
    success: true,
    message: '사용자 역할이 변경되었습니다',
    data: {
      id: updatedUser.id,
      role: updatedUser.role,
    },
  });
});

// ?) 관리자: 모든 유저 조회
export const listUsers = asyncHandler(async (req, res) => {
  const users = await listUsersService();

  res.status(200).json({
    success: true,
    message: '유저 목록 조회 성공',
    data: users,
  });
});
