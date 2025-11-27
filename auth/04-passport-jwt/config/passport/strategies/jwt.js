// TODO) Passport-JWT: 전략 설정 파일
// ?) JWT 토큰을 검증하고, payload 기반으로 유저를 식별하는 핵심 로직
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { env } from '../../env.js';
import { findUserById } from '../../../repositories/user-repository.js';

/**
 * &) Strategy as JwtStrategy
 * 원래 passport-jwt 모듈은 "Strategy"라는 클래스를 내보낸다.
 * import { Strategy } from 'passport-jwt';
 * 그런데 이름이 구분하기 힘듬(LocalStrategy, GoogleStrategy 등도 Strategy임)
 * 그래서 가독성을 위해 이름을 바꿔주는 것이 개발자의 마인드다.
 *
 * &) ExtractJwt
 * ExtractJwt는 JWT 토큰을 어디서 꺼내올지 정의하는 도우미 객체다.
 * 왜 필요하냐면, 토큰이 헤더에 있을 수도, 쿠키에 있을 수도 있기 때문이다.
 * 이걸 통해 이런 식으로 지정한 것이다.
 * jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
 * “요청의 Authorization 헤더에서 Bearer <token> 형식으로 토큰을 꺼내라”
 */

// ?) JWT 전략 등록 함수
// *) setupPassport()에서 호출됨
export function setupJwtStrategy() {
  passport.use(
    'jwt',
    new JwtStrategy(
      {
        // ?) 토큰 추출 방식 지정
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

        // ?) Access Token 검증 시 사용할 비밀키
        // *) 토큰 서명이 서버가 발급한 것인지 확인하는 핵심 요소
        secretOrKey: env.jwt.accessSecret,

        // ?) 만료된 토큰 자동 거부
        ignoreExpiration: false,
      },

      // ?) 검증 콜백(verify callback)
      // *) 토큰 payload 기반으로 실제 유저를 찾아 req.user에 주입하는 단계
      async (payload, done) => {
        try {
          // ?) payload.id 기준으로 유저 조회
          const user = await findUserById(payload.id);

          // ?) 유저 없음 → 인증 실패
          if (!user) return done(null, false);

          // ?) 인증 성공 → req.user = user 저장
          return done(null, {
            id: user.id,
            email: user.email,
            role: user.role,
          });
        } catch (err) {
          // ?) DB 오류 등 → 인증 실패 처리
          return done(err, false);
        }
      }
    )
  );
}

/**
 * &) 핵심 정리
 * *) 1. jwtFromRequest
 * Authorization: Bearer <token> 형식에서 JWT를 자동 추출하는 옵션.
 *
 * *) 2. secretOrKey
 * 서버가 서명한 토큰인지 확인하기 위한 비밀키.
 * Access Token에 대한 검증만 담당한다.
 *
 * *) 3. verify callback(payload, done)
 * 검증 성공 시 payload.id로 유저 조회 → req.user에 데이터를 넣음.
 * 검증 실패(done(null, false)) 또는 에러(done(err, false)) 처리.
 *
 * *) 4. Passport의 인증 흐름
 * requireAuth(passport.authenticate('jwt', { session: false }))
 * → jwt 전략 실행
 * → 토큰 검증 + 유저 조회
 * → req.user 주입
 *
 * *) 5. 이 전략 파일은 “JWT 인증의 심장부” 역할을 한다.
 * - 인증: 토큰이 유효한가?
 * - 식별: 어떤 사용자인가?
 */
