// TODO) Google OAuth-Strategy: 외부 로그인 인증 로직
// ?) Google에서 유저 정보를 받아 DB 조회 후 회원가입/로그인 처리
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../../constants.js';
import prisma from '../../prisma.js';

// ?) Google Strategy 등록
export const googleStrategy = new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID, // Google OAuth Client ID
    clientSecret: GOOGLE_CLIENT_SECRET, // Client Secret (절대 외부 공개 금지)
    callbackURL: 'http://localhost:3000/auth/google/callback',
    // ^) 로그인 성공 후 돌아올 URL (Google 콘솔에 동일하게 등록해야 함!)
  },

  /**
   * &) verifyCallback: 핵심 로직
   * *) Google이 사용자 인증을 완료하면 이 함수가 실행된다.
   * accessToken → Google API 호출용 (필요하면 프로필 더 가져올 때 사용)
   * refreshToken → 장기 토큰 (Google은 잘 안 줌)
   * profile → Google 측 사용자 정보 (id, email, 이름 등)
   */

  async function (accessToken, refreshToken, profile, cb) {
    try {
      // *) provider + providerId로 사용자 존재 여부 확인
      const user = await prisma.user.findUnique({
        where: {
          // Prisma 스키마에 providerId가 유니크이므로 단일 키로 조회
          providerId: profile.id,
        },
      });
      // ^) 복합 unique를 사용한다면 이런 패턴
      // ^) 아니면 원래 코드처럼 where: { provider: 'google', providerId } 써도 OK

      if (user) {
        // ?) 기존 유저면 그대로 로그인 처리
        return cb(null, user);
      }

      // ?) 신규 가입 처리
      const newUser = await prisma.user.create({
        data: {
          provider: 'google', // 어떤 OAuth인지 저장
          providerId: profile.id, // Google 고유 ID (중복 불가)
          username: profile.id, // 이메일 없을 경우 기본값으로 ID 사용
          password: null, // OAuth 계정은 비번 없음
        },
      });

      return cb(null, newUser);
    } catch (err) {
      return cb(err);
    }
  }
);

/**
 * &) 핵심 정리
 * 1. Google이 인증 → 우리 서버로 profile 전송
 * 2. provider + providerId로 유저 식별
 * 3. DB에 존재하면 로그인
 * 4. 없으면 자동 회원가입
 * 5. cb(null, user) → Passport가 serializeUser 진행
 *
 * !) 주의
 * - callbackURL은 Google Cloud Console에 반드시 등록해야 작동한다.
 * - profile.id는 Google 계정 하나당 고유 식별자.
 * - OAuth 계정은 password가 null인 것이 정상.
 */
