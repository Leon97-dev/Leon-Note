// TODO) Product-Constants: 상품 관련 공통 상수
// ?) 상품 도메인에서 반복 사용되는 정렬 규칙과 기본값을 한 곳에서 관리하는 상수 모음
export const PRODUCT_ORDER = {
  RECENT: 'recent',
  OLDEST: 'oldest',
};

export const PRODUCT_ORDER_MAP = {
  [PRODUCT_ORDER.RECENT]: { createdAt: 'desc' },
  [PRODUCT_ORDER.OLDEST]: { createdAt: 'asc' },
};

export const DEFAULT_PRODUCT_ORDER = PRODUCT_ORDER.RECENT;

/**
 * -------------------------------
 * [Product Constants: 상품 도메인 공통 상수]
 * -------------------------------
 *
 * &) 목적
 * 상품 리스트 조회에서 사용하는 정렬 기준(최신순 / 오래된순)을
 * 전역적으로 통일하기 위해 만든 상수 모음이다.
 *
 * 서비스 로직 곳곳에서 문자열을 직접 입력하면
 * 오타, 중복, 유지보수 문제(문자열 변경 시 전체 파일 수정)가 발생한다.
 * 상수로 관리하면 도메인 규칙을 한 곳에서만 변경하면 되므로 유지보수가 쉬워진다.
 *
 * -------------------------------
 * [왜 필요한가?]
 * -------------------------------
 *
 * 1) 문자열 중복 제거
 *    `"recent"` 같은 문자열을 여러 파일에서 반복적으로 쓰면 오타로 인한 버그가 발생하기 쉬움.
 *
 * 2) 프론트/백엔드 간 ENUM 역할
 *    상품 정렬 기준은 프론트 UI에서도 동일하게 사용되므로
 *    “약속된 단어” 같은 형태로 관리하는 게 안정적이다.
 *
 * 3) Prisma 쿼리 매핑에 사용
 *    실제 정렬 로직은 Prisma의 `orderBy` 옵션으로 연결되므로
 *    ENUM → Prisma 옵션 형태의 매핑이 필요함.
 *
 * -------------------------------
 * [상수 구성 설명]
 * -------------------------------
 *
 * - PRODUCT_ORDER
 *   정렬 기준 ENUM (recent / oldest)
 *
 * - PRODUCT_ORDER_MAP
 *   실제 Prisma의 orderBy 옵션에 대응되는 객체
 *   예: { createdAt: 'desc' } 또는 { createdAt: 'asc' }
 *
 * - DEFAULT_PRODUCT_ORDER
 *   상품 정렬의 기본값 (보통 최신순)
 *
 * 이렇게 구성하면, 컨트롤러와 서비스에서 동일한 패턴으로 재사용 가능하다.
 *
 * -------------------------------
 * [정리]
 * -------------------------------
 *
 * PRODUCT_ORDER, PRODUCT_ORDER_MAP, DEFAULT_PRODUCT_ORDER는
 * 상품 리스트 정렬 기능을 안정적으로 통일하기 위한 “도메인 전용 상수”다.
 *
 * 상수 관리의 장점:
 * - 오타 방지
 * - 코드 가독성 향상
 * - 도메인 규칙을 한 곳에서 관리
 * - 프론트/백엔드 ENUM 통일 가능
 *
 * constant 폴더에 두는 것이 가장 적절한 구조이며,
 * 실무 프로젝트에서도 그대로 사용하는 패턴이다.
 */
