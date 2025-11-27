// TODO) Health-Routes: URL 매핑
import express from "express";
import {
  checkHealth,
  checkDatabase,
} from "../controllers/health-controller.js";

const router = express.Router();

// ?) 서버 연결 확인
router.get("/", checkHealth);

// ?) DB 연결 확인
router.get("/db", checkDatabase);

export default router;
