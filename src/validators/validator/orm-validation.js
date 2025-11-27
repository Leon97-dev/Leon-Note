// TODO) ORM-Validation: ORM 레벨 검증 (Prisma, Sequelize 등)
/**
 * ?) ORM 레벨 검증은 “코드”와 “DB 스키마” 사이에서 일어나는 검증이다.
 * - 예: NOT NULL, UNIQUE, FOREIGN KEY 같은 제약 조건
 * - Prisma에서는 schema.prisma에서 정의
 *
 * 중요한 포인트:
 * 1) ORM 스키마 자체가 "검증 규칙" 역할을 한다.
 * 2) 잘못된 값을 넣으면 ORM이 에러(예: PrismaClientKnownRequestError)를 던진다.
 * 3) 우리는 이 에러를 잡아서 → 클라이언트에 의미 있는 메시지로 변환한다.
 */

/**
 * &) 1) Prisma 스키마에서의 검증 (schema.prisma 예시)
 * *) prisma/schema.prisma
 *
 * model User {
 *   id        Int     @id @default(autoincrement())
 *
 *   ?) NOT NULL + UNIQUE
 *   email     String  @unique
 *
 *   ?) NOT NULL
 *   name      String
 *
 *   ?) 선택값(optional) + 최소/최대 범위는 DB 타입으로 제한 가능
 *   age       Int?    @db.SmallInt
 *
 *   ?) createdAt / updatedAt 자동값
 *   createdAt DateTime @default(now())
 *   updatedAt DateTime @updatedAt
 * }
 *
 * 여기서 이미 이런 검증이 걸려 있다:
 * - email: NULL 불가 + 중복 불가 (UNIQUE)
 * - name: NULL 불가 (NOT NULL)
 * - age: smallint 범위만 허용 (DB 타입으로 간접 검증)
 *
 * 즉, 이 스키마 자체가 "ORM 레벨 검증 규칙"이다.
 */

import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * &) 2) ORM 레벨에서 발생하는 대표 에러 코드 (Prisma 기준)
 * PrismaClientKnownRequestError.code 예시:
 * - P2002: Unique constraint failed (UNIQUE 위반)
 * - P2003: Foreign key constraint failed (FK 위반)
 * - P2000: 값이 너무 길어서 DB 컬럼에 못 들어가는 경우 등
 *
 * 이런 에러는 "ORM이 DB 제약 조건을 지키려고 뱉는 검증 실패"라고 보면 된다.
 */

/**
 * &) 3) ORM 에러를 HTTP 응답으로 변환하는 헬퍼
 * 서비스/컨트롤러에서 try/catch로 Prisma 에러를 잡고,
 * 사용자 친화적인 메시지로 바꿔주는 역할.
 */

function mapPrismaErrorToHttp(e) {
  // ?) Prisma에서 오는 '알려진' 에러 타입인지 체크
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    // ?) UNIQUE 위반 (예: email 중복)
    if (e.code === 'P2002') {
      const target = (e.meta && e.meta.target) || 'field';
      return {
        status: 409, // Conflict
        body: {
          message: '이미 사용 중인 값입니다.',
          field: target,
        },
      };
    }

    // ?) FK 위반 (존재하지 않는 id 참조 등)
    if (e.code === 'P2003') {
      return {
        status: 400,
        body: {
          message: '존재하지 않는 관련 데이터를 참조했습니다.',
        },
      };
    }

    // ?) 그 밖의 Known 에러들
    return {
      status: 400,
      body: {
        message: '요청 처리 중 데이터베이스 제약 조건을 위반했습니다.',
        code: e.code,
      },
    };
  }

  // ?) Unknown / 다른 종류의 에러는 서버 에러로 처리
  return {
    status: 500,
    body: {
      message: '알 수 없는 서버 오류가 발생했습니다.',
    },
  };
}

/**
 * &) 4) 실제 서비스 코드 예시: User 생성
 * ORM 레벨 검증의 핵심은:
 * "일단 시도 → Prisma가 제약 위반 에러를 던짐 → 우리가 잡아서 의미 있는 응답으로 변환"
 */

export async function createUserService(data) {
  try {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        age: data.age ?? null,
      },
    });

    return {
      ok: true,
      user,
    };
  } catch (e) {
    // ?) Prisma 에러를 HTTP 응답 형태로 변환
    const httpError = mapPrismaErrorToHttp(e);
    return {
      ok: false,
      error: httpError,
    };
  }
}

/**
 * &) 5) Express 컨트롤러에서 사용하는 예시
 * import express from 'express';
 * import { createUserService } from './orm-validation.js';
 *
 * const app = express();
 * app.use(express.json());
 *
 * app.post('/users', async (req, res) => {
 *   *) 여기서는 이미 스키마 검증(Zod 등)을 통과했다고 가정하고,
 *   *) ORM + DB 제약 조건을 마지막 방어선으로 사용한다.
 *
 *   const result = await createUserService(req.body);
 *
 *   if (!result.ok) {
 *     return res.status(result.error.status).json(result.error.body);
 *   }
 *
 *   res.status(201).json({
 *     message: '회원 생성 성공',
 *     user: result.user,
 *   });
 * });
 *
 * app.listen(3000, () => console.log('서버 실행 중'));
 */

/**
 * &) 요약 정리
 * *) 1. Prisma 스키마 = ORM 레벨 규칙
 *  - @id, @default, @unique, @updatedAt, @db.SmallInt 등
 *  - DB 제약 조건과 1:1로 연결되는 부분이 많다.
 *
 * *) 2. 잘못된 값이 들어오면 Prisma가 에러를 던진다.
 *  - 예: email UNIQUE 위반 → P2002
 *  - 예: FK 위반 → P2003
 *
 * *) 3. 서비스 레벨에서 에러를 잡아 의미 있는 메시지로 매핑
 *  - mapPrismaErrorToHttp 같은 헬퍼로 일관성 유지
 *
 * *) 4. 전체 검증 흐름 속 위치
 *  - 프론트: 기본 입력 검증
 *  - 백엔드: 스키마 기반 검증(Zod / class-validator 등)
 *  - 비즈니스 규칙 검증(재고, 권한 등)
 *  - ORM / DB: 마지막 방어선 (제약 조건 위반 방지)
 *
 * ORM 레벨 검증은 “마지막 방패” 같은 존재라서,
 * 상위 레이어에서 실수해도 데이터 자체가 망가지지 않도록 지켜준다.
 */
