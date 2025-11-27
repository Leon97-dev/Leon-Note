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
} from '../repositories/user-repository.js';

// ?) 회원가입
export async function registerUser({ email, password, name }) {
  const exist = await findUserByEmail(email);
  if (exist) throw new ConflictError('이미 존재하는 email입니다');

  const hashed = await hashPassword(password); // 해시된 비밀번호
  return createUser({ email, password: hashed, name }); // DB에 해쉬와 같이 개인 정보 저장
}

// ?) 로그인
export async function loginUser(email, password) {
  const user = await findUserByEmail(email);
  if (!user)
    throw new UnauthorizedError('이메일 또는 비밀번호가 유효하지 않습니다');

  const ok = await verifyPassword(password, user.password);
  if (!ok)
    throw new UnauthorizedError('이메일 또는 비밀번호가 유효하지 않습니다');

  return user;
}

// ?) 내 정보 조회
export async function getMe(userId) {
  const user = await findUserById(userId);
  if (!user) throw new NotFoundError('유저를 찾을 수 없습니다');
  return user;
}

// ?) 닉네임 변경
export async function changeNickname(userId, nickname) {
  return updateUser(userId, { name: nickname });
}

// ?) 비밀번호 변경
export async function changePassword(userId, oldPw, newPw) {
  const user = await findUserById(userId);
  if (!user) throw new NotFoundError('유저를 찾을 수 없습니다');

  const ok = await verifyPassword(oldPw, user.password);
  if (!ok) throw new UnauthorizedError('기존 비밀번호가 일치하지 않습니다');

  const hashed = await hashPassword(newPw);
  return updateUser(userId, { password: hashed });
}

// ?) 계정 삭제
export async function deleteAccount(userId) {
  await findUserById(userId); // 존재 여부 확인
  return deleteUser(userId); // 에러 처리 x findUserById에서 에러 던짐
}

// !) 확장하면 추가 로직들
// ? 프로필 변경 규칙  -> user-service.js
// * (profile validation은 validator에서, business rule은 service에서)
// ? 회원 탈퇴 시 연관 데이터 삭제 -> user-service.js
// ? 로그인 시도 실패 횟수 제한 -> user-service.js
// ? 계정 잠금 정책 등 -> user-service.js
