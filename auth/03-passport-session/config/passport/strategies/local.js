// TODO) Passport-Local: 로컬 로그인 전략
// ?) email + password 기반 회원 인증 처리
import { Strategy as LocalStrategy } from "passport-local";
import { prisma } from "../../prisma.js";
import { verifyPassword } from "../../../utils/hash.js";

/**
 * &) Passport done() 개념 요약
 * *) done()은 LocalStrategy → Passport 본체로 결과를 전달하는 전용 콜백!
 * *) return 값은 이 콜백 함수 밖으로 전달되지 않기 때문에 반드시 done을 통해 보고해야 함.
 *
 * ?) done(null, user)
 * 인증 성공 → Passport가 req.user에 user 저장
 *
 * ?) done(null, false, info)
 * 인증 실패 → req.user 없음
 *
 * ?) done(error)
 * 시스템 오류 → Express 에러 핸들러로 이동
 *
 * *) 결국 done()은 "전략 파일과 Passport 엔진을 연결하는 통신 함수"
 */

// ?) 로컬 전략 등록 함수
// *) passport.use()는 index.js에서 실행됨
export function setupLocalStrategy(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" }, // 기본 username 대신 email 사용
      async (email, password, done) => {
        try {
          // ?) 이메일로 유저 조회
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) {
            return done(null, false, {
              message: "잘못된 이메일 또는 비밀번호입니다",
            });
          }

          // ?) 비밀번호 검증
          const ok = await verifyPassword(password, user.password);
          if (!ok) {
            return done(null, false, {
              message: "잘못된 이메일 또는 비밀번호입니다",
            });
          }

          // ?) 인증 성공 → req.user로 전달
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}

/**
 * &) 콜백 흐름 설명
 * - LocalStrategy는 email/password가 맞는지 검증하는 전략
 * - done(null, user) → 로그인 성공 → req.user = user
 * - done(null, false) → 로그인 실패
 * - done(error) → DB 오류 등 시스템 에러
 */
