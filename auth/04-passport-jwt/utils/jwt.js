// TODO) JWT: 토큰 발급/검증 유틸
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

// ?) Access Token 발급
export const signAccessToken = (payload) => {
  return jwt.sign(payload, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpires,
  });
};

// ?)  Refresh Token 발급
export const signRefreshToken = (payload) => {
  return jwt.sign(payload, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpires,
  });
};

// ?) Access Token 검증
export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.jwt.accessSecret);
};

// ?) Refresh Token 검증
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.jwt.refreshSecret);
};
