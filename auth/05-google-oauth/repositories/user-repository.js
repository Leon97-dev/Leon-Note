// TODO) User-Repository: 유저 DB 접근 계층
// ?) Prisma를 통해 User 테이블에 직접 접근하는 순수 데이터 레이어
import prisma from '../config/prisma.js';

// ?) 유저 조회: ID 기준
export async function findUserById(id) {
  return prisma.user.findUnique({
    where: { id },
  });
}

// ?) 유저 조회: username 기준
export async function findUserByUsername(username) {
  return prisma.user.findUnique({
    where: { username },
  });
}

// ?) 로컬 유저 생성 (username/password 방식)
export async function createLocalUser(username, hashedPassword) {
  return prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      provider: 'local',
      providerId: username,
    },
  });
}

// ?) (선택) OAuth 유저 생성용 – 필요 시 사용
export async function createOAuthUser(provider, providerId, username) {
  return prisma.user.create({
    data: {
      username,
      password: null,
      provider,
      providerId,
    },
  });
}
