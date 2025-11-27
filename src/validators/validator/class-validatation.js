// TODO) Class-Validation: 클래스 기반 검증 (DTO 방식)
// ?) class-validator는 데코레이터(애노테이션) 기반 검증 라이브러리다.

/**
 * &) npm i class-validator class-transformer
 * Express에서도 사용할 수 있지만,
 * 원래 NestJS에서 대규모 서비스 구축을 도와주는 스타일이기 때문에
 * DTO 구조를 깔끔하게 유지하고 싶은 팀에서 자주 채택한다.
 */

import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

/**
 * &) 1) DTO 정의 (Data Transfer Object)
 * 목적:
 * - 요청(Request)의 구조를 "클래스"로 명확하게 표현
 * - 데코레이터로 각 필드의 규칙을 선언적으로 정의
 *
 * 장점:
 * - 대규모 프로젝트에서 일관된 구조 유지
 * - IDE 자동완성 강력
 * - TS 타입 + 검증 조건을 하나의 클래스에서 관리
 */

export class CreateUserDto {
  @IsString({ message: '이름은 문자열이어야 합니다.' })
  @MinLength(2, { message: '이름은 최소 2글자 이상이어야 합니다.' })
  name;

  @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
  email;

  @IsOptional()
  @IsInt({ message: '나이는 정수만 가능합니다.' })
  @Min(1, { message: '나이는 1 이상이어야 합니다.' })
  age;
}

/**
 * &) 2) 미들웨어 형태로 DTO 검증
 * 과정:
 * - plainToInstance: req.body → DTO 인스턴스로 변환
 * - validate: DTO에 적힌 규칙대로 검사
 *
 * validate()는 오류를 리스트로 반환하므로,
 * 이를 우리가 보던 errors 구조로 가공한다.
 */

export function validateDto(dtoClass) {
  return async (req, res, next) => {
    // ?) req.body를 DTO 형식으로 변환
    const dtoInstance = plainToInstance(dtoClass, req.body);

    // ?) class-validator 실행
    const errors = await validate(dtoInstance);

    if (errors.length === 0) {
      req.validatedData = dtoInstance;
      return next();
    }

    // ?) 오류 변환 (우리 스타일에 맞게)
    const formatted = errors.flatMap((err) =>
      Object.values(err.constraints).map((msg) => ({
        field: err.property,
        message: msg,
      }))
    );

    return res.status(400).json({
      message: '입력값 검증 실패',
      errors: formatted,
    });
  };
}

/**
 * &) 3) Express 라우터에서 사용하는 예시
 *
 * import express from 'express';
 * import { validateDto, CreateUserDto } from './class-validator.js';
 *
 * const app = express();
 * app.use(express.json());
 *
 * app.post('/users', validateDto(CreateUserDto), (req, res) => {
 * *) 여기까지 들어오면 DTO 규칙 통과 완료!
 * *) req.validatedData는 DTO 인스턴스 그대로 담긴다.
 *
 *   const user = req.validatedData;
 *
 *   res.json({
 *     message: '회원 생성 성공',
 *     user,
 *   });
 * });
 *
 * app.listen(3000, () => console.log('서버 실행 중'));
 */

/**
 * &) 요약 정리
 * *) 1. DTO 클래스 작성
 * 요청 구조 + 검증 규칙을 하나의 클래스 안에 선언적으로 정의한다.
 *
 * *) 2. validateDto 미들웨어
 * req.body → DTO 변환 후, class-validator로 검사하여 오류를 가공해 반환.
 *
 * *) 3. 라우터에서 사용
 * 검증된 DTO 인스턴스를 req.validatedData로 전달.
 *
 * 클래스 기반 검증은 스키마 기반보다 구조적이고,
 * 팀 단위로 큰 프로젝트를 운영할 때 특히 강력하다.
 */
