// TODO) User-Routes: 유저 관련 URL 매핑
import express from 'express';
import validate from '../validator/validate.js';
import {
  RegisterUser,
  LoginUser,
  UpdateUserRole,
} from '../validator/user-validator.js';
import {
  register,
  login,
  refresh,
  logout,
  me,
  updateName,
  updatePassword,
  removeAccount,
  listUsers,
  updateUserRole,
} from '../controllers/user-controller.js';
import { requireAuth } from '../middlewares/auth.js';
import { requireRole } from '../middlewares/role.js';

const router = express.Router();

// &) Auth (회원가입/로그인/토큰/로그아웃)
// ?) 회원가입
router.post('/register', validate(RegisterUser), register);

// ?) 로그인
router.post('/login', validate(LoginUser), login);

// ?) 로그아웃
router.post('/logout', requireAuth, logout);

// ?) 토큰 재발급
router.post('/token/refresh', refresh);

// &) Users (유저 정보/관리)
// ?) 내 정보
router.get('/me', requireAuth, me);

// ?) 닉네임 변경
router.patch('/name', requireAuth, updateName);

// ?) 비밀번호 변경
router.patch('/password', requireAuth, updatePassword);

// ?) 계정 삭제
router.delete('/', requireAuth, removeAccount);

// ?) 관리자: 유저 역할 변경
router.patch(
  '/:id/role',
  requireAuth,
  requireRole('ADMIN'),
  validate(UpdateUserRole),
  updateUserRole
);

// ?) 관리자: 모든 유저 조회
router.get('/', requireAuth, requireRole('ADMIN'), listUsers);

export default router;
