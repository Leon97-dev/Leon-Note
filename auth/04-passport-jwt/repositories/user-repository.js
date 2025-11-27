// TODO) User-Repository: 유저 DB 접근 로직
// ?) 유저 Repo -> DB로 가는 최종 단계
import prisma from '../config/prisma.js';

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

// ?) 로그인 성공 시 RefreshToken 저장
export async function setUserRefreshToken(userId, token) {
  // ^) login 컨트롤러에서 user.id, refreshToken 가져옴
  return prisma.user.update({
    where: { id: userId },
    data: { refreshToken: token },
  }); // ^) 해당 유저의 DB 레코드에 새 토큰을 저장하고 나중에 로그아웃하거나 재발급할 때 이 DB 값을 참조함
}

// ?) 로그아웃 시 RefreshToken 삭제
export async function clearUserRefreshToken(userId) {
  return prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });
}

// ?) 유저 전체 목록 조회 (관리자용)
export async function listUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { id: 'asc' },
  });
}

/**
 * &) DB에 Refresh Token을 저장하는 이유
 * JWT는 기본적으로 “서버가 상태를 저장하지 않는다”(stateless)는 게 장점이다.
 * 그런데 로그아웃을 하려면, 서버가 이 사용자의 Refresh Token을 알아야 하기 때문에,
 * 로그인 시 발급된 refreshToken을 DB에 저장해두는 것이다.
 * 사용자가 “로그아웃”을 하면, DB의 refreshToken을 null로 비워 더 이상 재발급할 수 없게 만든다.
 */
