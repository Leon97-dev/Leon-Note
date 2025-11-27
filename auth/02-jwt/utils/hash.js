// TODO) Hash: 비밀번호 해시/검증 유틸
// ?) 비밀번호 보안 처리 (Service에서 재사용하는 순수 함수)
import bcrypt from 'bcrypt';

// ?) 환경변수로 해시 강도 주입 (환경별로 유연하게 설정)
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS ?? 10);

/**
 * ?) 왜 SALT_ROUNDS를 .env로 관리하는가?
 * 로컬/테스트/프로덕션 환경마다 보안 강도 요구사항이 다르기 때문
 * 코드에 숫자를 박아두면 변경 시 유지보수가 어렵기 때문
 *
 * @example
 * 로컬:  8~10   (빠른 테스트)
 * 스테이징: 12
 * 프로덕션: 14~16  (강한 보안)
 */

// ?) 비밀번호 해시 생성 (회원가입/비번 변경 시 사용)
export async function hashPassword(plain) {
  // *) bcrypt는 72바이트 초과 비밀번호는 내부에서 잘라버림 → 길이 검사 권장
  if (plain.length > 72) throw new Error('비밀번호가 너무 깁니다.');

  const hash = await bcrypt.hash(plain, SALT_ROUNDS);

  /**
   * &) bcrypt.hash(plain, SALT_ROUNDS)
   * plain: 평문 비번
   * SALT_ROUNDS: 해시 계산 강도
   * 내부적으로 random salt 생성 → 평문+salt 조합 → 반복 해시 → 최종 문자열 반환
   */

  return hash;
}

// ?) 비밀번호 검증 (로그인 시)
export async function verifyPassword(plain, hashed) {
  return bcrypt.compare(plain, hashed);

  /**
   * &) bcrypt.compare(plain, hashed)
   * 입력받은 평문을 동일한 방식으로 해시하여 DB 해시와 비교
   * 일치하면 true, 불일치 시 false
   * 비밀번호는 절대 복호화하지 않음!
   */
}

/**
 * &) 핵심 정리
 * *) hashPassword()
 * 새로운 비밀번호 생성 시 사용 (회원가입, 비밀번호 변경)
 * 평문을 안전한 bcrypt 해시로 변환
 * salt 자동 생성 + 반복 해싱
 * *) verifyPassword()
 * 로그인 시 사용
 * 평문을 해싱해 DB의 해시와 비교 (복호화 없음)
 *
 * 이 둘은 “순수 함수”라서 utils 레벨에 존재하는 것이 맞다.
 * 서비스/컨트롤러 어디에서도 재사용 가능하도록 설계된 구조다.
 */
