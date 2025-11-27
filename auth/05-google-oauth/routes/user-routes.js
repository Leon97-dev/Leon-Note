// TODO) User-Routes: 사용자 관리 엔드포인트
// ?) 프로필 조회/수정, 비밀번호 변경, 계정 삭제, 관리자 유저 관리
import express from 'express';
import { requireAuth } from '../middlewares/require-auth.js';
import { requireRole } from '../middlewares/role.js';
import {
  getMe,
  updateName,
  updatePassword,
  removeAccount,
  listUsers,
  updateUserRole,
} from '../controllers/user-controller.js';

const router = express.Router();

// ?) 내 정보 조회
router.get('/me', requireAuth, getMe);

// ?) 닉네임 변경
router.patch('/name', requireAuth, updateName);

// ?) 비밀번호 변경
router.patch('/password', requireAuth, updatePassword);

// ?) 계정 삭제
router.delete('/', requireAuth, removeAccount);

// &) 관리자 전용 영역
// ?) 모든 유저 목록 조회
router.get('/', requireAuth, requireRole('ADMIN'), listUsers);

// ?) 특정 유저 역할 변경 (ADMIN만)
router.patch('/:id/role', requireAuth, requireRole('ADMIN'), updateUserRole);

export default router;
