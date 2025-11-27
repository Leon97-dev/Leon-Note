// TODO) Hash: 비밀번호 해시/검증 유틸
// ?) 비밀번호 보안 처리 (Service에서 재사용하는 순수 함수)
import bcrypt from "bcrypt";

// ?) 비밀번호 해시화
export async function hashPassword(password) {
  const saltRounds = 10; // *) 해쉬 강도
  return bcrypt.hash(password, saltRounds);
}

// ?) 비밀번호 검증
export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}
