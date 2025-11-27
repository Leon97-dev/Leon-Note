// TODO) User-Service: 비즈니스 로직
// ?) 유저 관련 예외 처리 후 -> 유저 Repo로 리턴
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} from '../core/error/error-handler.js';
import { hashPassword, verifyPassword } from '../utils/hash.js';
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
  deleteUser,
  listUsers as listUsersFromRepo,
} from '../repositories/user-repository.js';

// ?) 회원가입
export async function registerUser({ email, password, name }) {
  const exists = await findUserByEmail(email);
  if (exists) {
    throw new ConflictError('이미 존재하는 email입니다');
  }

  const hashed = await hashPassword(password);
  return createUser({ email, passwordHash: hashed, name });
}

// ?) 로그인
export async function loginUser(email, password) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new UnauthorizedError('이메일 또는 비밀번호가 유효하지 않습니다');
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    throw new UnauthorizedError('이메일 또는 비밀번호가 유효하지 않습니다');
  }

  return user; // 비즈니스 로직만 처리, 토큰은 auth-service에서 처리
}

// ?) 내 정보 조회
export async function getMe(userId) {
  const user = await findUserById(userId);
  if (!user) {
    throw new NotFoundError('유저를 찾을 수 없습니다');
  }
  return user;
}

// ?) 닉네임 변경
export async function changeNickname(userId, nickname) {
  const user = await findUserById(userId);
  if (!user) throw new NotFoundError('유저를 찾을 수 없습니다');

  return updateUser(userId, { name: nickname });
}

// ?) 비밀번호 변경
export async function changePassword(userId, oldPw, newPw) {
  const user = await findUserById(userId);
  if (!user) {
    throw new NotFoundError('유저를 찾을 수 없습니다');
  }

  const ok = await verifyPassword(oldPw, user.passwordHash);
  if (!ok) {
    throw new UnauthorizedError('기존 비밀번호가 일치하지 않습니다');
  }

  const hashed = await hashPassword(newPw);
  return updateUser(userId, { passwordHash: hashed });
}

// ?) 계정 삭제
export async function deleteAccount(userId) {
  const user = await findUserById(userId);
  if (!user) {
    throw new NotFoundError('유저를 찾을 수 없습니다');
  }

  return deleteUser(userId);
}

// ?) 역할 변경 (관리자용)
export async function changeUserRole(userId, role) {
  const user = await findUserById(userId);
  if (!user) {
    throw new NotFoundError('유저를 찾을 수 없습니다');
  }

  return updateUser(userId, { role });
}

// ?) 모든 유저 조회 (관리자용)
export async function listUsers() {
  return listUsersFromRepo();
}
