# 모듈(Module) 개념

# 1. 정의

특정 기능을 수행하는 코드 단위 파일로,
프로그램을 여러 조각으로 나누어 관리하기 위한 코드 구조의 최소 단위이다.
Node.js에서는 .js 파일 하나하나가 모두 모듈이다.

# 2. 모듈이 필요한 이유

**< 코드 분리와 재사용 >**
한 파일에 모든 코드를 넣으면 유지보수가 어렵다.
기능별로 나누면 역할이 명확해지고, 다른 곳에서도 재활용 가능하다.

**< 의존성 관리 >**
필요한 부분만 import해서 사용 가능하다.
불필요한 코드 로딩을 방지해 성능이 향상된다.

**< 협업 효율 >**
팀 단위 개발 시 기능 단위 분업이 가능해진다.

# 3. Node.js의 모듈 시스템

Node.js는 두 가지 모듈 시스템을 지원한다.

- `CommonJS`: Node.js 기본 모듈 시스템 (옛 방식)
  \_ 파일 확장자: .cjs, .js
  \_ 불러오기 문법: require() / module.exports

- `ES Module (ESM)`: 최신 표준 (ES6 이후 권장)
  \_ 파일 확장자: .mjs, .js + "type": "module"
  \_ 불러오기 문법: import / export

# 4. 내장 모듈 (Built-in Modules)

Node.js는 자주 쓰이는 기능을 기본 내장 모듈로 제공한다.
**이들은 npm 설치 없이 바로 사용할 수 있다.**

- `path`
- `fs`
- `os`
- `http, https`
- `crypto`
- `url`
- `events`
- `stream`

_자주 쓰이는 모듈 위주이며, 각 모듈의 설명은 파일 참고_

# 5. 외부 모듈 (External Modules)

npm을 통해 설치한 외부 패키지도 모듈로 동작한다.
Node.js는 내장 모듈 → node_modules 폴더 → 상위 디렉토리 탐색 순으로 모듈을 로드한다.
이걸 **모듈 해석 경로(Module Resolution)**라고 한다.

# 6. export / import 종류

**< 기본 내보내기 (default) >**

```js
export default function greet() { ... }
import greet from './greet.js';
```

**< 이름 내보내기 (named) >**

```js
export const name = 'Leon';
export function hello() { ... }

import { name, hello } from './utils.js';
```

**< 전체 불러오기 >**

```js
import * as utils from './utils.js';
utils.hello();
```

_tip_
export default로 기본을 내보내면 {} 없이 import
여러 export 중 가져 와야 한다면 {} 필수

# 7. 모듈의 범위(Scope)

각 모듈은 자신만의 독립적인 스코프를 가진다.
전역 변수 오염이 없다.
필요한 값만 export해서 공유한다.

```js
// a.js
const secret = 'hidden';
export const open = 'visible';

// b.js
import { open } from './a.js';
console.log(open); // ✅ visible
console.log(secret); // ❌ 접근 불가
```
