// TODO) User-Routes: URL 매핑
import express from "express";
import validate from "../validator/validate.js";
import { RegisterUser, LoginUser } from "../validator/user-validator.js";
import requireSession from "../middlewares/require-session.js";
import {
  register,
  login,
  me,
  logout,
  updateName,
  updatePassword,
  removeAccount,
} from "../controllers/user-controller.js";

const router = express.Router();

// ?) 회원가입
router.post("/register", validate(RegisterUser), register);

// ?) 로그인
router.post("/login", validate(LoginUser), login);

// ?) 내 정보 (세션 기반 보호)
router.get("/me", requireSession, me);

// ?) 로그아웃 (로그인 상태에서만 가능)
router.post("/logout", requireSession, logout);

// ?) 닉네임 변경
router.patch("/me/name", requireSession, updateName);

// ?) 비밀번호 변경
router.patch("/me/password", requireSession, updatePassword);

// ?) 계정 삭제
router.delete("/me", requireSession, removeAccount);

export default router;

// !) 확장하면 로직 추가해야함
