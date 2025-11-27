// TODO) Require-Session: 세션 인증 미들웨어
// ?) 로그인 후 세션이 있는지 검사
import { UnauthorizedError } from "../core/error/error-handler.js";

export default function requireSession(req, _res, next) {
  if (!req.session?.userId) {
    throw new UnauthorizedError("로그인이 필요합니다");
  }

  next();
}
