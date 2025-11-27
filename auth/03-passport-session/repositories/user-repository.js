// TODO) User-Repository: 유저 DB 접근 로직
// ?) 유저 Repo -> DB로 가는 최종 단계
import prisma from "../config/prisma.js";

// ?) 유저 생성
export async function createUser(data) {
  return prisma.user.create({
    data,
  });
}

// ?) 이메일로 유저 조회
export async function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
  });
}

// ?) ID로 유저 조회
export async function findUserById(id) {
  return prisma.user.findUnique({
    where: { id },
  });
}

// ?) 유저 정보 수정 (닉네임/비번 변경 포함)
export async function updateUser(id, data) {
  return prisma.user.update({
    where: { id },
    data,
  });
}

// ?) 유저 삭제 (회원 탈퇴)
export async function deleteUser(id) {
  return prisma.user.delete({
    where: { id },
  });
}
