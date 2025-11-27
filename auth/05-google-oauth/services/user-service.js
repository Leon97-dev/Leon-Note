// TODO) User-Service: 사용자 비즈니스 로직 계층
// ?) 유저 데이터 처리(조회/수정/삭제 등)를 담당하고 DB 접근은 repo로 위임한다.
import bcrypt from 'bcrypt';
import {
  findUserById,
  findUserByUsername,
  updateUser,
  deleteUser,
  listUsers as listUsersRepo,
} from '../repositories/user-repository.js';

// ?) 내 정보 조회
// *) session/토큰에서 얻은 userId 기반으로 유저 조회
export async function getMe(userId) {
  const user = await findUserById(userId);
  if (!user) throw new Error('유저를 찾을 수 없습니다.');
  return user;
}

// ?) 닉네임 변경
export async function changeNickname(userId, name) {
  const user = await findUserById(userId);
  if (!user) throw new Error('유저를 찾을 수 없습니다.');

  return updateUser(userId, { username: name });
}

// ?) 비밀번호 변경
export async function changePassword(userId, oldPw, newPw) {
  const user = await findUserById(userId);
  if (!user) throw new Error('유저를 찾을 수 없습니다.');

  const ok = await bcrypt.compare(oldPw, user.password);
  if (!ok) throw new Error('비밀번호가 올바르지 않습니다.');

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(newPw, salt);

  return updateUser(userId, { password: hashed });
}

// ?) 계정 삭제
export async function removeAccount(userId) {
  const user = await findUserById(userId);
  if (!user) throw new Error('유저를 찾을 수 없습니다.');

  return deleteUser(userId);
}

// ?) 관리자 권한으로 전체 유저 조회
export async function listUsers() {
  return listUsersRepo();
}

// ?) 특정 유저 역할 변경
export async function changeUserRole(userId, role) {
  const user = await findUserById(userId);
  if (!user) throw new Error('유저를 찾을 수 없습니다.');

  return updateUser(userId, { role });
}
