// TODO) Local-Strategy: 기본 로그인 (username + password)
// ?) 사용자가 직접 입력한 계정 정보로 인증하는 전략
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import prisma from '../../prisma.js';

/**
 * &) Local 로그인 전략
 * usernameField, passwordField를 지정하지 않으면,
 * 기본적으로 req.body.username, req.body.password를 사용한다.
 */

export const localStrategy = new LocalStrategy(async function (
  username,
  password,
  done
) {
  try {
    // *) 유저 조회
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      // ?) 사용자 없음 → 인증 실패
      return done(null, false, { message: 'Invalid username' });
    }

    // *) 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return done(null, false, { message: 'Invalid password' });
    }

    // ?) 인증 성공 → user 객체 넘기기
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

/**
 * &) 핵심 정리
 * 1. LocalStrategy는 username/password 기반 인증이다.
 * 2. 인증 성공 시 done(null, user)
 * 3. 인증 실패 시 done(null, false)
 * 4. bcrypt.compare()로 비밀번호 시큐어 비교
 * 5. Local 로그인 성공 후 → serializeUser() → 세션에 user.id 저장됨
 */
