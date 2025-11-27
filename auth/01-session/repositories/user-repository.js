// TODO) User-Repository: 유저 DB 접근 로직
// ?) 유저 Repo -> DB로 가는 최종 단계
import prisma from '../config/prisma.js';

// ?) 유저 생성
export async function createUser(data) {
  return prisma.user.create({
    data,
  });
}

// ?) 이메일로 유저 조회
export async function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
  });
}

// ?) ID로 유저 조회
export async function findUserById(id) {
  return prisma.user.findUnique({
    where: { id },
  });
}

// ?) 유저 정보 수정 (닉네임/비번 변경 포함)
export async function updateUser(id, data) {
  return prisma.user.update({
    where: { id },
    data,
  });
}

// ?) 유저 삭제 (회원 탈퇴)
export async function deleteUser(id) {
  return prisma.user.delete({
    where: { id },
  });
}

/**
 * &) 필수! findUnique vs findUniqueOrThrow
 * 인증/비밀번호/로그인 로직에서는 findUniqueOrThrow를 거의 안 쓴다.
 * 이유는 존재하지 않아도, 존재해도, 둘 다 상황에 따라 개발자가 정확한 메시지를 직접 던져야 하기 때문이다.
 *
 * @example
 * const user = await findUnique({ email });
 * if (!user) throw new Unauthorized("이메일 없음");
 *
 * 여기서 자동으로 404나 500을 던지는 건 UX적으로 최악이다.
 * 로그인 페이지에서 “오… 404? 500?” 이런 오류 나오면 헷갈리기 때문!
 * 그러니까 개발자가 스스로 메시지와 상태 코드를 정리해야 한다.
 * 그래서 로그인에서는 findUniqueOrThrow 거의 안 씀.
 *
 * ~) 결론!
 * *) 인증(로그인/회원가입/비번변경/세션)에서는 findUnique만 쓴다.
 * *) findUniqueOrThrow는 “존재해야 정상인 데이터”를 다루는 도메인에서 주로 쓴다.
 * 상품, 주문, 카테고리, 게시글 같은 리소스 중심 모델 등등
 */
