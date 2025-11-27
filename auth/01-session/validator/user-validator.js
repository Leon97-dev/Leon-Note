// TODO) User-Validator: 유저 유효성 검사
import * as s from 'superstruct';

// ?) 이메일 형식 검사
const Email = s.pattern(s.string(), /^\S+@\S+\.\S+$/);
// *) 실무에서 가장 흔한 이메일 정규식, a@b.c 같은 기본 구조 검증

// ?) 비밀번호 길이/형식 검사
const Password = s.size(s.string(), 8, 64);

// ?) 닉네임 길이 검사
const Name = s.optional(s.size(s.string(), 1, 30));

// ?) 회원가입 기본 필드 검사
export const RegisterUser = s.object({
  email: Email,
  password: Password,
  name: Name,
});

// ?) 로그인 필수 입력 검사
export const LoginUser = s.object({
  email: Email,
  password: Password,
});

// !) 나머지 유저 관련 검사는 비즈니스 로직으로 처리!
