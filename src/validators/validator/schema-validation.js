// TODO) Schema-Validation: 스키마 기반 검증
// ?) Zod: 스키마 기반 검증 라이브러리
import { z } from 'zod';

/**
 * &) 1) 스키마 정의 (Schema Definition)
 * 스키마는 “들어와야 하는 데이터의 모양”을 미리 적어놓은 설계도다.
 * 들어온 객체가 이 설계도와 다르면 Zod가 자동으로 오류를 뱉는다.
 */

export const createUserSchema = z.object({
  name: z.string().min(2, '이름은 최소 2글자 이상이어야 합니다.'),

  email: z.string().email('이메일 형식이 올바르지 않습니다.'),

  age: z
    .number()
    .int('정수만 가능합니다.')
    .min(1, '나이는 1 이상이어야 합니다.')
    .optional(), // age는 선택값
});

/**
 * &) 2) 미들웨어 형태로 스키마 검증
 * 실제 Express 경로(path)에서 req.body를 검사할 때 사용한다.
 * 스키마.validate 대신 zod의 safeParse를 쓰면 직접 예외를 던지지 않고,
 * 성공/실패 여부를 결과로 알려준다.
 */

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    // ?) result.success === true → 통과
    if (result.success) {
      req.validatedData = result.data; // 검증된 데이터만 다음 단계로 넘김
      return next();
    }

    // ?) 실패 시 에러 목록을 가공해 클라이언트로 보냄
    const errors = result.error.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    return res.status(400).json({
      message: '입력값 검증 실패',
      errors,
    });
  };
}

/**
 * &) 3) Express 라우터에서 사용하는 예시
 * import express from "express";
 * const app = express();
 * app.use(express.json());
 *
 * app.post("/users", validate(createUserSchema), (req, res) => {
 * *) 여기까지 들어왔다는 건 이미 통과한 상태!
 * *) req.body 대신 req.validatedData를 사용해도 된다.
 *  const user = req.validatedData;
 *  res.json({
 *    message: '회원 생성 성공',
 *    user,
 *  });
 * });
 *
 * app.listen(3000, () => console.log('서버 실행 중'));
 */

/**
 * &) 요약 정리
 * *) 1. 스키마 정의
 * “올바른 데이터 구조”를 미리 정해둔다. (name/email/age의 규칙)
 *
 * *) 2. validate 미들웨어
 * 들어오는 req.body가 스키마 규칙을 어기면 바로 400 에러 반환
 * 통과하면 req.validatedData로 검증된 데이터만 다음 단계로 전달
 *
 * *) 3. 라우터에서 사용
 * 라우터는 검증을 신경 안 써도 된다.
 * 이미 검증된 데이터만 받기 때문에 코드가 깔끔해진다.
 */
