# Jest — 자바스크립트 테스트 프레임워크

_참고 사이트_
https://jestjs.io/

---

# 1. 개요

Jest는 JavaScript/TypeScript 환경에서 가장 널리 사용되는 테스트 프레임워크(Test Runner + Assertion Library) 다.
프론트/백엔드 어디서든 사용할 수 있고,
설정 없이도 바로 테스트를 작성할 수 있는 “올인원 테스트 도구”다.

npm i --save-dev jest ✅ 설치 필요

---

# 2. 주요 역할

- 테스트 실행(Test Runner)
- expect() 기반 단언문 제공
- 비동기 테스트 지원
- mock(함수/모듈/타이머) 지원
- 코드 커버리지 측정
- TypeScript/Node/프론트 모두 지원

즉, 테스트 도구의 풀패키지 버전이라고 보면 된다.

---

# 3. 테스트 파일 구조

Jest는 다음 파일 패턴을 자동으로 탐지한다.

```bash
*.test.js
*.spec.js
__tests__/*.js

# 예시
math.test.js
```

---

# 4. 기본 테스트 예시

```js
// math.js
export function add(a, b) {
  return a + b;
}

// math.test.js
import { add } from './math';

test('두 숫자를 더한다', () => {
  expect(add(2, 3)).toBe(5);
});
```

---

# 5. 기본 단언문(expect)

```js
expect(value).toBe(10);
expect(value).toEqual({ a: 1 });
expect(array).toContain(3);
expect(str).toMatch(/hello/);
```

---

# 6. 비동기 테스트

```js
// Promise 기반
test('비동기 테스트', async () => {
  const data = await fetchData();
  expect(data).toBe('OK');
});

// 콜백 기반
test('콜백 테스트', (done) => {
  getUser((id) => {
    expect(id).toBe(1);
    done();
  });
});
```

---

# 7. Mock 기능 (가장 강력한 부분)

mock 기능은 Jest의 핵심이자 실무에서 자주 쓰이는 기능이다.

```js
// 함수 mock
const mockFn = jest.fn();
mockFn('hello');
expect(mockFn).toHaveBeenCalledWith('hello');

// 모듈 mock
jest.mock('./api');

// 타이머 mock
jest.useFakeTimers();
```

---

# 8. Jest 설정 (package.json)

기본 세팅 없이도 돌아가지만, 프로젝트별 설정도 가능하다.

```json
{
  "scripts": {
    "test": "jest"
  },
  "jest": {
    "testEnvironment": "node"
  }
}
```

Node.js API 테스트에서는 testEnvironment: 'node'가 일반적이다.

---

# 9. 코드 커버리지

```bash
npm test -- --coverage
```

출력: 함수가 얼마나 테스트되었는지, 분기, 라인, 함수 커버리지
CI에서 자주 사용하는 기능이다.

---

# 10. Jest vs 다른 테스트 라이브러리

- `Jest`
  \_ 철학: 올인원
  \_ mock: 내장
  \_ 속도: 보통
  \_ 설정: 거의 불필요

- `Mocha`
  \_ 철학: 최소구성
  \_ mock: 외부 패키지 필요
  \_ 속도: 느림
  \_ 설정: 세팅 많이 필요

- `Vitest`
  \_ 철학: Jest 대체 프레임워크
  \_ mock: 내장
  \_ 속도: 빠름 (ESM/TS 최적화)
  \_ 설정: 간단함

**Node.js 백엔드, Next.js 프론트 둘 다 Jest를 가장 많이 사용한다.**
