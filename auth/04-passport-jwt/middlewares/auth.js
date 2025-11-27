// TODO) Auth: 인증 미들웨어 (passport-jwt 방식)
// ?) passport 전략에 등록된 'jwt' 전략을 실행하고, 실패 시 JSON 메시지로 응답한다.
import passport from 'passport';

export const requireAuth = (req, res, next) => {
  passport.authenticate(
    'jwt',
    {
      session: false,
      failWithError: true, // 실패를 next(err)로 넘겨 커스텀 응답 처리
    },
    (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: info?.message || '인증에 실패했습니다',
          error: 'UNAUTHORIZED',
        });
      }
      req.user = user;
      next();
    }
  )(req, res, next);
};
