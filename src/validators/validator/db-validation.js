// TODO) DB-Level Validation: 트리거 + Constraint 기반 검증
/**
 * ?) 데이터베이스는 “가장 신뢰할 수 있는 검증층”이다.
 * 백엔드 코드가 실수하더라도, DB 제약 조건이 잘 설정되어 있다면
 * 데이터 무결성(integrity)은 절대 깨지지 않는다.
 *
 * 이 레벨은 두 가지로 구성된다:
 * 1) Constraint (제약 조건) → Prisma 스키마와 직접 연결됨
 * 2) Trigger (트리거) → 조건을 만족하지 않을 때 자동 실행되는 DB 함수
 *
 * 백엔드 엔지니어는 이 둘을 이해해야 데이터가 안전하다는 확신을 가질 수 있다.
 */

/**
 * &) 1) Constraint (제약 조건)
 * 가장 기본적이고 실무에서 반드시 사용하는 DB 수준의 검증.
 *
 * PostgreSQL 기준 예시:
 *
 * CREATE TABLE users (
 *   id SERIAL PRIMARY KEY,
 *   email TEXT NOT NULL UNIQUE,   -- NOT NULL + UNIQUE
 *   name TEXT NOT NULL,           -- NOT NULL
 *   age INT CHECK (age >= 1),     -- CHECK 제약 조건
 *   company_id INT REFERENCES companies(id)  -- FK(외래키)
 * );
 *
 * 이 제약 조건들은 다음을 보장한다:
 * - email이 null이면 거부
 * - email이 중복이면 거부
 * - age가 0 이하이면 거부
 * - 존재하지 않는 company_id면 거부 (FK)
 *
 * 즉, 데이터베이스 자체가 "검증"을 한다.
 */

/**
 * &) 2) CHECK 제약 조건
 * 특정 값이 조건을 충족해야만 INSERT/UPDATE가 가능하다.
 *
 * age INT CHECK (age >= 1)
 *
 * - age가 1보다 작으면 DB가 곧바로 에러를 던진다.
 * - 백엔드가 잘못됐어도 데이터 깨짐을 방지.
 */

/**
 * &) 3) FOREIGN KEY 제약 조건 (참조 무결성)
 * company_id INT REFERENCES companies(id)
 *
 * - companies 테이블에 없는 id를 넣으면 DB가 거부.
 * - 삭제/업데이트 시 동작은 옵션으로 결정 가능:
 *   ON DELETE CASCADE / RESTRICT 등
 *
 * DB는 “관계가 잘못되면 절대 삽입 못하게” 막아준다.
 */

/**
 * &) 4) UNIQUE 제약 조건
 * email TEXT UNIQUE
 *
 * - 중복 email은 절대 허용하지 않음.
 * - Prisma에서는 P2002 에러로 변환됨.
 *
 * 가장 흔하게 쓰이고 가장 중요한 데이터 무결성 규칙.
 */

/**
 * &) 5) NOT NULL 제약 조건
 * name TEXT NOT NULL
 *
 * - 필수값을 빼먹으면 DB 자체가 막아준다.
 * - 백엔드에서 null 체크를 깜빡해도 데이터는 안전하다.
 */

/**
 * &) 6) Trigger (트리거 기반 검증)
 * 트리거는 "특정 조건에서 자동 실행되는 DB 함수".
 * 일반적으로 CHECK로 표현하기 어려운 복잡한 검증에 사용.
 *
 * 예: 주문 후 재고 수량 자동 차감, 조건 위반 시 예외 발생 등
 *
 * PostgreSQL 예시:
 *
 * CREATE OR REPLACE FUNCTION check_stock_before_order()
 * RETURNS trigger AS $$
 * BEGIN
 *   IF NEW.quantity > (SELECT stock FROM products WHERE id = NEW.product_id) THEN
 *     RAISE EXCEPTION '재고가 부족합니다';
 *   END IF;
 *   RETURN NEW;
 * END;
 * $$ LANGUAGE plpgsql;
 *
 * CREATE TRIGGER validate_stock
 * BEFORE INSERT ON orders
 * FOR EACH ROW
 * EXECUTE FUNCTION check_stock_before_order();
 *
 * 설명:
 * - 주문 INSERT가 들어올 때
 * - 주문량 > 재고이면
 * - DB가 "재고 부족" 예외를 던져서 INSERT 자체가 막힌다.
 *
 * 백엔드에서 계산 실수해도 DB가 최종적으로 보정해준다.
 */

/**
 * &) 7) 백엔드(Prisma)와 연동 흐름
 * 트리거나 제약 조건이 걸린 테이블에서 Prisma로 create/update 하면:
 *   → PostgreSQL이 먼저 검사
 *   → 위반 시 SQL 에러 발생
 *   → Prisma가 PrismaClientKnownRequestError로 포장
 *   → 우리가 mapPrismaErrorToHttp()에서 처리
 *
 * 예: UNIQUE(email) 위반 → P2002
 * 예: FK 위반 → P2003
 * 예: CHECK(age >= 1) 위반 → SQLSTATE 23514
 */

/**
 * &) 8) DB 제약이 중요한 이유
 * 앱/서버/ORM 레벨 검증이 아무리 철저해도,
 * 비동기 상황이나 버그, 레이스 컨디션, 배포 충돌 같은 상황이 발생하면
 * 항상 "예상치 못한 잘못된 값"이 DB에 도착할 수 있다.
 *
 * DB 제약 조건 없으면:
 * - 중복 email 저장
 * - 음수 가격 저장
 * - 존재하지 않는 user_id 참조
 * - 날짜가 null
 * 이런 데이터가 영구적으로 망가질 수 있다.
 *
 * 제약 조건이 있으면:
 * - DB가 잘못된 INSERT/UPDATE 자체를 거부
 * - 데이터는 절대 망가지지 않음
 */

/**
 * &) 요약 정리
 * *) Constraint (NOT NULL, UNIQUE, CHECK, FK)
 *  - ORM·서버 이전에 DB가 먼저 검증 → 데이터 무결성 보장
 *
 * *) Trigger
 *  - CHECK로 표현하기 어려운 복잡한 규칙을 DB 함수로 직접 검증
 *
 * *) Prisma 연동
 *  - DB 에러 → Prisma Known Error → 우리가 HTTP 응답 변환
 *
 * *) 이 레벨이 가장 중요한 이유
 *  - 모든 검증 레이어 중 유일하게 완전히 신뢰할 수 있는 방어선
 *  - 서버가 실수해도, 제약 조건이 DB를 지켜준다
 *
 * 이 레벨을 제대로 이해하면 “백엔드=데이터 지킴이”의 진짜 감각이 생긴다.
 */
