// TODO) Auth-Controller: 요청/응답 담당 계층
// ?) 실제 로직은 서비스에서 처리하고 컨트롤러는 req → service 호출 → res 반환 ONLY
import asyncHandler from '../core/error/async-handler.js';
import {
  registerUser,
  validateLoginUser,
  rotateTokensService,
  buildOAuthUser,
} from '../services/auth-service.js';
import {
  setTokenCookies,
  clearTokenCookies,
} from '../services/cookie-service.js';

// ?) 회원가입
export const register = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await registerUser(username, password);

  res.status(201).json({
    ok: true,
    message: '회원가입 완료',
    data: {
      id: user.id,
      username: user.username,
      provider: user.provider,
    },
  });
});

// ?) 로그인 (LocalStrategy 성공 후 req.user 제공됨)
export const login = asyncHandler(async (req, res) => {
  const user = await validateLoginUser(req.user);

  const tokens = user.tokens;

  // ?) 쿠키 설정
  setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

  res.status(200).json({
    ok: true,
    message: '로그인 성공',
  });
});

// ?) 토큰 재발급 (refresh-token 전략 성공 → req.user 제공)
export const refresh = asyncHandler(async (req, res) => {
  const tokens = await rotateTokensService(req.user.id);

  setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

  res.status(200).json({
    ok: true,
    message: '토큰 재발급 성공',
  });
});

// ?) 로그아웃
export const logout = asyncHandler(async (req, res) => {
  clearTokenCookies(res);
  res.status(200).json({
    ok: true,
    message: '로그아웃 완료',
  });
});

// ?) 구글 OAuth 콜백
export const googleCallback = asyncHandler(async (req, res) => {
  const user = await buildOAuthUser(req.user);

  const tokens = user.tokens;

  setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

  // ?) 로그인 성공 안내 페이지로 이동 (콜백 URL이 바로 보이지 않는 혼란 방지)
  res.redirect('/auth/google/success');
});
