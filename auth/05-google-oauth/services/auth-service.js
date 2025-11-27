// TODO) Auth-Service: 인증 비즈니스 로직 계층
// ?) DB 접근 없이, 인증 흐름(Local/OAuth/JWT)을 처리하는 순수 서비스 모듈
import bcrypt from 'bcrypt';
import { generateTokens } from '../utils/token.js';
import {
  findUserById,
  findUserByUsername,
  createLocalUser,
} from '../repositories/user-repository.js';

const SALT_ROUNDS = 10;

// ?) 회원가입
export async function registerUser(username, password) {
  const exists = await findUserByUsername(username);
  if (exists) {
    throw new Error('이미 존재하는 사용자입니다.');
  }

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await createLocalUser(username, hashedPassword);

  return user;
}

// ?) 로그인 (LocalStrategy 이후)
export async function validateLoginUser(user) {
  if (!user) {
    throw new Error('로그인 정보가 유효하지 않습니다.');
  }

  const tokens = generateTokens(user.id);

  return {
    user,
    tokens,
  };
}

// ?) 토큰 재발급
export async function rotateTokensService(userId) {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error('유저를 찾을 수 없습니다.');
  }

  const tokens = generateTokens(user.id);
  return tokens;
}

// ?) OAuth 콜백 처리 (Google 등)
export async function buildOAuthUser(user) {
  if (!user) {
    throw new Error('OAuth 사용자 정보를 찾을 수 없습니다.');
  }

  const tokens = generateTokens(user.id);

  return {
    user,
    tokens,
  };
}
