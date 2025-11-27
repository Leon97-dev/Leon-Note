// TODO) TS-Validation: 타입 기반 검증 (TypeScript Narrowing)
/**
 * TypeScript는 런타임 검증(실행 중 체크)은 하지 않지만,
 * 개발 단계에서 “타입 시스템으로 위험한 동작을 미리 방지”한다.
 *
 * Narrowing(내로잉)은 타입을 점점 좁혀서
 * "이 변수는 지금 이런 타입이 맞다"는 확신을 만드는 과정이다.
 *
 * 즉, TS 타입 기반 검증은 코드가 실행되기 전에 오류를 막아주는
 * 사전 검증(pre-validation) 레이어라고 보면 된다.
 */

/**
 * &) 1) 기본적인 Narrowing 예시
 * 함수의 입력 타입이 `string | number` 라면
 * TS는 일단 두 타입 모두를 고려한다.
 * 우리가 조건문으로 타입을 좁히면 Narrowing이 발생한다.
 */

function printLength(value: string | number) {
  // ?) Narrowing 전: value는 string | number

  if (typeof value === 'string') {
    // ?) Narrowing 후: value는 string
    console.log('문자 길이:', value.length);
  } else {
    // ?) Narrowing 후: value는 number
    console.log('숫자 자릿수:', value.toString().length);
  }
}

/**
 * &) 2) 타입 가드(User-Defined Type Guard)
 * TS에서 함수로 타입 Narrowing을 직접 만들어내는 기술.
 * 반환 타입을 `value is 타입` 형태로 정의한다.
 */

interface User {
  id: number;
  name: string;
  admin?: boolean;
}

function isUser(value: unknown): value is User {
  // ?) 런타임 체크 + TS Narrowing 동시에 활용
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  );
}

/**
 * 사용 예:
 */
function handleData(data: unknown) {
  if (isUser(data)) {
    // ?) Narrowing 성공 → data는 User 타입이 확정됨
    console.log('유저 이름:', data.name);
  } else {
    console.log('User 타입이 아님');
  }
}

/**
 * &) 3) Optional 체이닝 + Null 체크 Narrowing
 * TS는 null 체크만으로도 타입을 좁혀준다.
 */

function getUsername(user?: User | null) {
  if (!user) {
    return '이름 없음';
  }

  // ?) Narrowing 후: user는 User 타입 확정
  return user.name;
}

/**
 * &) 4) 배열/객체 타입 검증
 * typeof 로는 객체 구조를 검증할 수 없지만,
 * Array.isArray() 같은 직접적인 체크는 Narrowing을 유도한다.
 */

function process(input: unknown) {
  if (Array.isArray(input)) {
    // ?) Narrowing 후: input은 any[]
    console.log('배열 길이:', input.length);
  } else if (typeof input === 'object' && input !== null) {
    // ?) Narrowing 후: object
    console.log('객체입니다.');
  }
}

/**
 * &) 5) TS 타입 기반 검증의 한계
 * - 런타임에서는 아무것도 검증해주지 않는다.
 * - 빌드된 JavaScript에는 타입 정보가 전혀 없다.
 * - 따라서 런타임 검증(Zod, Joi 등)이 반드시 필요하다.
 *
 * 하지만!
 * 타입 기반 검증은 개발 단계에서 엄청난 안정성을 준다:
 * - 잘못된 타입 전달을 컴파일러가 막아줌
 * - 도메인 모델이 안정적으로 유지됨
 * - 자동완성·IDE 지원이 극대화됨
 *
 * 즉, 런타임 검증이 “실행 중 안전성”이라면
 * 타입 검증은 “개발 중 안정성”이다.
 */

/**
 * &) 요약 정리
 * *) 타입 기반 검증(TypeScript Narrowing)
 *   - 런타임에는 관여하지 않지만, 잘못된 코드 작성 자체를 막아주는 단계
 *
 * *) Narrowing 예시
 *   - typeof, null 체크, Array.isArray, in 연산자 등
 *
 * *) User-Defined Type Guard
 *   - 직접 만든 “타입 판별 함수”로 타입을 좁히는 기법
 *
 * *) 장점
 *   - 코드 예측 가능성 증가
 *   - IDE 자동완성 강화
 *   - 타입 오류를 미리 차단 → 개발 과정 안정
 *
 * *) 단점
 *   - 런타임 검증이 아니다 → 실제 값 검증은 다른 레이어가 필요
 *
 * 타입 기반 검증은 결국 “타입 안전성”을 보장하는 필수 단계이고,
 * 런타임 검증(Zod/Validator/DB 제약)과 함께 사용할 때 가장 강력해진다.
 */
