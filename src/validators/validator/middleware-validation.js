// TODO) Middleware-Validation: 미들웨어 기반 검증
/**
 * ?) “미들웨어”는 라우터에 들어오기 전에 지나가는 관문이다.
 * 이 관문에서 요청(req)의 body / params / query 등을 검사하고,
 * 이상이 있으면 컨트롤러로 넘어가기 전에 즉시 막아버린다.
 *
 * Express, Fastify, Koa 같은 서버 프레임워크는
 * 검증을 미들웨어로 분리하면 코드가 단정하고 유지보수가 쉬워진다.
 *
 * 미들웨어 방식은 특정 라이브러리에 종속되지 않는다.
 * - Zod 스키마 검증도 미들웨어 기반
 * - Manual Validation도 미들웨어 기반
 * - Class Validator도 미들웨어 기반
 *
 * 결국 “미들웨어 기반”은 검증의 전략(strategy)이다.
 */

/**
 * &) 1) 가장 기본적인 미들웨어 구조
 * 목적: req.body가 비어 있는지, JSON인지 등 기본 체크.
 */

export function requireBody(req, res, next) {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: '요청 body가 비어 있습니다.',
    });
  }
  next();
}

/**
 * &) 2) 필드 존재 여부를 강제하는 미들웨어
 * 필요 필드를 배열 형태로 전달하면,
 * 그 필드들이 모두 있는지 검사하는 범용 미들웨어.
 */

export function requireFields(fields = []) {
  return (req, res, next) => {
    const missing = fields.filter((field) => req.body[field] == null);

    if (missing.length > 0) {
      return res.status(400).json({
        message: '필수 값 누락',
        missingFields: missing,
      });
    }

    next();
  };
}

/**
 * &) 3) 예시: 특정 타입 검사 미들웨어
 * 아주 단순한 검증만 하고 싶은 경우 사용.
 */

export function requireNumber(fieldName) {
  return (req, res, next) => {
    const value = req.body[fieldName];

    if (typeof value !== 'number') {
      return res.status(400).json({
        message: `${fieldName}은(는) 숫자여야 합니다.`,
      });
    }
    next();
  };
}

/**
 * &) 4) Express 라우터에서 사용하는 예시
 * import express from 'express';
 * import { requireBody, requireFields, requireNumber } from './middleware-validation.js';
 *
 * const app = express();
 * app.use(express.json());
 *
 * ?) 회원 생성
 * app.post(
 *   '/users',
 *   requireBody,                // *) body가 비어있는지 확인
 *   requireFields(['name','email']), // *) 필수 필드 강제
 *   requireNumber('age'),       // *) age 필드는 number인지 검사
 *   (req, res) => {
 *     *) 여기까지 왔다면 3개의 미들웨어를 모두 통과한 상태!
 *     res.json({
 *       message: '회원 생성 성공',
 *       data: req.body, // 여기선 스키마 없이 그대로 사용
 *     });
 *   }
 * );
 *
 * app.listen(3000, () => console.log('서버 실행 중'));
 */

/**
 * &) 요약 정리
 * *) 1. requireBody
 * 요청이 비어 있으면 시작부터 막는다.
 *
 * *) 2. requireFields(['name', 'email'])
 * 필수 필드가 모두 들어왔는지 검사한다.
 *
 * *) 3. requireNumber('age')
 * 단일 타입을 강제하는 간단한 미들웨어.
 *
 * *) 4. 라우터에서 검증 미들웨어를 ‘쌓아서’ 사용
 * 경로마다 필요한 검증 조합을 만들 수 있어 유연하다.
 *
 * 미들웨어 기반 검증은 “전략”이기 때문에
 * 나중에 Zod든 Class Validator든 언제든 미들웨어로 끼워 넣을 수 있다.
 * 실무에서 가장 널리 쓰이는 검증 스타일이다.
 */
