// TODO) Auth-Routes: 인증 관련 엔드포인트 모음
// ?) Local 로그인, 회원가입, JWT 재발급, Logout, OAuth 콜백 등 모든 인증 흐름 관리
import express from 'express';
import passport from '../config/passport/index.js';
import {
  register,
  login,
  refresh,
  logout,
  googleCallback,
} from '../controllers/auth-controller.js';

const router = express.Router();

// ?) 회원가입
router.post('/register', register);

// ?) Local 로그인 (passport-local 적용)
// *) local 전략 성공 시 req.user 제공됨
router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  login
);

// ?) Refresh Token 재발급
router.post(
  '/refresh',
  passport.authenticate('refresh-token', { session: false }),
  refresh
);

// ?) 로그아웃 (쿠키 삭제)
router.post('/logout', logout);

// ?) Google OAuth 시작
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
    prompt: 'select_account', // 매번 계정/동의 화면을 보여주도록 요청
  })
);

// ?) Google OAuth 콜백 → 토큰 발급
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  googleCallback
);

// ?) Google OAuth 성공 안내 (쿠키는 이미 설정된 상태)
router.get('/google/success', (req, res) => {
  res.send(
    `<h1>Google 로그인 성공</h1>
     <p>토큰이 쿠키로 설정되었습니다.</p>
     <p>DevTools → Application → Cookies → http://localhost:3000 에서 access-token, refresh-token을 확인하세요.</p>`
  );
});

export default router;
