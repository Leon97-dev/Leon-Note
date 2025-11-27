// TODO) Manual-Validation: 단순 조건문 기반 검증
// ?) 조건문(if)으로 직접 검증하는 가장 기본적인 방식

/**
 * &) 1) 단일 필드 검증 함수들
 * 목적: 각 속성마다 "말이 되는지" 검사하는 순수 함수.
 * 이런 함수들은 독립적이라 테스트하기 쉽고 재사용성이 좋다.
 */

function validateName(name) {
  if (typeof name !== 'string') {
    return '이름은 문자열이어야 합니다.';
  }
  if (name.length < 2) {
    return '이름은 최소 2글자 이상이어야 합니다.';
  }
  return null; // 문제 없음
}

function validateEmail(email) {
  if (typeof email !== 'string') {
    return '이메일은 문자열이어야 합니다.';
  }
  if (!email.includes('@')) {
    return '이메일 형식이 올바르지 않습니다.';
  }
  return null;
}

function validateAge(age) {
  if (age == null) return null; // optional

  if (typeof age !== 'number') {
    return '나이는 숫자여야 합니다.';
  }
  if (!Number.isInteger(age)) {
    return '나이는 정수만 가능합니다.';
  }
  if (age < 1) {
    return '나이는 1 이상이어야 합니다.';
  }
  return null;
}

/**
 * &) 2) 객체 전체를 검증하는 함수
 * req.body 전체를 검사해 에러를 모아서 반환.
 * 스키마 기반 검증이 없는 환경에서 종종 사용된다.
 */

export function manualUserValidator(req, res, next) {
  const { name, email, age } = req.body;

  // ?) 개별 체크
  const errors = [];

  const nameErr = validateName(name);
  if (nameErr) errors.push({ field: 'name', message: nameErr });

  const emailErr = validateEmail(email);
  if (emailErr) errors.push({ field: 'email', message: emailErr });

  const ageErr = validateAge(age);
  if (ageErr) errors.push({ field: 'age', message: ageErr });

  // ?) 실패 처리
  if (errors.length > 0) {
    return res.status(400).json({
      message: '입력값 검증 실패',
      errors,
    });
  }

  // ?) 성공
  req.validatedData = { name, email, age };
  next();
}

/**
 * &) 3) Express 라우터에서 사용하는 예시
 * import express from 'express';
 * const app = express();
 * app.use(express.json());
 *
 * app.post('/users', manualUserValidator, (req, res) => {
 * *) 여기까지 들어오면 모든 조건문 검증을 통과한 상태.
 * *) 스키마 기반 방식과 동일하게 req.validatedData 사용 가능.
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
 * *) 1. 단일 조건 함수들
 * 각 필드의 유효성 조건을 if 문으로 직접 검사한다.
 *
 * *) 2. 전체 객체 검증 함수
 * req.body를 받아서 필드별 오류를 취합하고 반환한다.
 *
 * *) 3. 라우터에서 사용
 * 라우터는 검증을 신경 쓸 필요 없이 깨끗한 req.validatedData만 받는다.
 *
 * 단순 조건문 기반 검증은 가장 원초적이지만,
 * 커스텀 규칙이 많은 곳이나 작은 서비스에서는 여전히 강력하다.
 */
