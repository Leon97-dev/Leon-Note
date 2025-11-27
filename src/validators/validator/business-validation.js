// TODO) Business-Validation: 비즈니스 규칙 검증
/**
 * 비즈니스 규칙(Business Rule)은 단순한 데이터 형식 검증을 넘어서,
 * “우리 서비스가 실제로 어떻게 동작해야 하는지”를 정의한 규칙이다.
 *
 * 예:
 * - 주문 수량 > 재고 수량 → 주문 불가
 * - 직원은 자기 회사 소속 계약만 수정 가능
 * - 탈퇴한 사용자는 로그인 불가
 * - 등급(SILVER)은 할인율 5% 이상 불가
 *
 * 이런 검증은 스키마나 DB 제약만으로 표현할 수 없다.
 * 그래서 비즈니스 규칙 검증은 보통 Service 레이어에 위치한다.
 */

/**
 * &) 1) 실제 서비스 규칙 예시: 재고 검증
 * 상품 주문 전에 반드시 재고를 확인해야 한다.
 */

export function ensureStockEnough(product, orderCount) {
  if (!product) {
    throw new Error('존재하지 않는 상품입니다.');
  }

  if (product.stock < orderCount) {
    throw new Error('재고가 부족합니다.');
  }

  // 규칙 통과 → 아무것도 반환하지 않음
}

/**
 * &) 2) 회사 소속 검증: 직원 접근 권한
 * 직원이 수정하려는 자원이 본인 회사 소속인지 검사.
 */

export function ensureSameCompany(user, resource) {
  if (user.companyId !== resource.companyId) {
    throw new Error('해당 자원에 접근할 권한이 없습니다.');
  }
}

/**
 * &) 3) 상태 기반 규칙 예시: 계약 수정 제한
 * - 완료된 계약은 수정 불가
 * - 취소된 계약은 다시 활성화 불가 등
 */

export function ensureContractEditable(contract) {
  if (contract.status === 'COMPLETED') {
    throw new Error('완료된 계약은 수정할 수 없습니다.');
  }

  if (contract.status === 'CANCELED') {
    throw new Error('취소된 계약은 변경할 수 없습니다.');
  }
}

/**
 * &) 4) 서비스 레이어 내에서 규칙을 실제 적용하는 예시
 * 비즈니스 규칙은 보통 이런 위치에 등장한다:
 *  Controller → Service(여기서 비즈니스 규칙 적용) → ORM → DB
 */

import { prisma } from './prisma-client.js'; // 가정

export async function createOrderService(userId, productId, count) {
  // ?) 1) 데이터 조회
  const product = await prisma.product.findUnique({ where: { id: productId } });

  // ?) 2) 비즈니스 규칙 검증들
  ensureStockEnough(product, count);

  // ?) 규칙 통과 후 주문 생성
  return prisma.order.create({
    data: {
      userId,
      productId,
      count,
    },
  });
}

/**
 * &) 5) Express 컨트롤러처럼 사용하는 예시
 * app.post('/orders', async (req, res) => {
 *   try {
 *     const { userId, productId, count } = req.body;
 *
 *     const order = await createOrderService(userId, productId, count);
 *
 *     res.json({ message: '주문 생성 성공', order });
 *
 *   } catch (e) {
 *     res.status(400).json({
 *       message: e.message,
 *     });
 *   }
 * });
 */

/**
 * &) 요약 정리
 * *) 1. 비즈니스 규칙은 “서비스가 실제로 어떻게 굴러가야 하는지”를 정의한다.
 *    - 도메인 논리
 *    - 권한
 *    - 상태 변화 가능 여부
 *    - 회사 정책
 *
 * *) 2. 스키마, 타입, ORM, DB 제약으로는 표현할 수 없는 규칙들이다.
 *
 * *) 3. 위치는 대부분 Service 레이어.
 *    Controller는 요청만 받고,
 *    Service가 비즈니스 규칙을 통과시키고,
 *    ORM/DB는 마지막 무결성 방어선이 된다.
 *
 * *) 4. 비즈니스 규칙은 프로젝트가 커질수록 중요도가 폭발적으로 증가한다.
 *    데이터 형식이 맞아도 “의미가 틀렸다면” 시스템은 실패한다.
 */
