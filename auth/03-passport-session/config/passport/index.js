// TODO) Passport: 초기 설정 로직
// ?) 전략 등록 + 세션 직렬화/역직렬화
import passport from "passport";
import { setupLocalStrategy } from "./strategies/local.js";
import { prisma } from "../prisma.js";

/**
 * &) serializeUser / deserializeUser 개념 요약
 * *) Passport 세션 방식은 유저 객체 전체를 세션에 저장하지 않는다.
 * 대신 "유저 식별자(ID)"만 세션에 저장하여 보안·성능을 확보한다.
 *
 * ?) serializeUser(user, done)
 * 로그인 성공 시 한 번 호출
 * 세션에 저장할 최소 정보(보통 user.id)를 선택해서 done(null, id) 형태로 전달
 *
 * ?) deserializeUser(id, done)
 * 모든 요청마다 실행됨
 * 세션에 저장된 id를 DB에서 다시 조회해 실제 user 객체를 만들어 req.user에 넣는다.
 *
 * *) 즉, serialize → (세션에 ID 저장) → deserialize → (요청마다 req.user에 user 주입)
 * 이게 passport-session의 전체 흐름이다.
 */

export function setupPassport() {
  // ?) 로컬 로그인 전략 등록
  setupLocalStrategy(passport);

  // ?) 세션 직렬화 (유저 → session에 어떤 값을 저장할지 결정)
  passport.serializeUser((user, done) => {
    // *) 세션에는 user.id만 저장 (메모리 절약 + 보안)
    done(null, user.id);
  });

  // ?) 세션 역직렬화 (세션의 id → 실제 유저 객체 조회)
  passport.deserializeUser(async (id, done) => {
    try {
      // *) 요청마다 세션에 저장된 id로 유저를 다시 불러옴
      const user = await prisma.user.findUnique({ where: { id } });

      // *) user 없으면 인증 실패
      if (!user) return done(null, false);

      // *) req.user에 user 객체 자동 주입됨
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  });

  return passport;
}

/**
 * &) Passport 세션 구조 요약
 * *) 1. LocalStrategy(email, password)
 * 로그인 성공 시 user 객체를 passport가 받음
 *
 * *) 2. serializeUser(user)
 * 세션에는 user.id만 저장됨
 *
 * *) 3. 클라이언트가 요청 보냄 (쿠키에 세션 ID 포함)
 *
 * *) 4. deserializeUser(id)
 * → DB에서 id로 유저 조회
 * → req.user = 유저 정보
 *
 * 즉:
 * Strategy → serialize → (세션 저장) → deserialize → req.user
 * JWT는 클라이언트가 인증 정보를 보관하는 “stateless”
 * Session은 서버가 인증 정보를 보관하는 “stateful”
 * 이 차이만 있을 뿐, 구조는 거의 동일하다.
 */
