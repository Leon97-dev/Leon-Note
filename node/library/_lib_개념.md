# 라이브러리(Library) 개념

# 1. 정의

특정 기능을 수행하는 코드 모음집이자 개발자가 직접 호출해서 사용하는 도구 세트다.
즉, 필요한 기능만 꺼내서 쓸 수 있는 **기능 단위 모듈 집합**이다.
프레임워크처럼 구조를 강요하지 않고, “개발자가 필요할 때 불러 쓰는 유틸리티”에 가깝다.

# 2. 역할

반복되는 기능을 재사용 가능하게 만든 도구 상자
복잡한 로직을 캡슐화하여 개발 속도 향상
코드 일관성과 유지보수성 향상

```js
import dayjs from 'dayjs';
const now = dayjs().format('YYYY-MM-DD');
```

이 한 줄이 가능하도록 복잡한 날짜 계산 로직을 대신 처리해주는 게 바로 라이브러리다.

# 3. 특징

**< 개발자가 직접 호출한다 >**
라이브러리는 코드 흐름의 주도권이 개발자에게 있다.
필요한 시점에, 필요한 기능만 불러서 사용한다.

**< 구조 강제 없음 >**
프로젝트 폴더 구조나 코드 스타일을 강제하지 않는다.
단일 함수부터 대규모 API 세트까지 다양한 형태로 존재할 수 있다.

**< 독립성과 조합성 >**
하나의 라이브러리는 다른 라이브러리와 자유롭게 조합 가능하다.
예: Axios(HTTP 요청) + Dayjs(날짜 처리) + Lodash(데이터 조작)

# 4. 라이브러리의 종류

- `유틸리티형`: 공통 기능 제공 (데이터, 시간, 문자열 등)
  \_ Lodash, Dayjs, Moment.js

- `HTTP 클라이언트형`: 서버 통신 기능
  \_ Axios, node-fetch

- `검증/형식화형`: 입력값 검증, 스키마 정의
  \_ Zod, Superstruct, Joi

- `ORM/DB형`: 데이터베이스 접근
  \_ Prisma, Sequelize, Mongoose

- `UI형 (프론트엔드)`: UI 구성 요소 제공
  \_ React, Chart.js, Three.js

# 5. 장점과 단점

✅ 장점: 필요한 기능만 골라 사용 가능, 빠른 구현 속도, 작은 학습 비용, 자유로운 조합 가능

❌ 단점: 통합 구조가 없어서 코드 일관성 떨어질 수 있음,라이브러리마다 사용법이 다름, 버전 충돌 시 관리 어려움, 책임 분리가 명확하지 않을 수 있음

# 6. 라이브러리의 핵심 철학

“필요한 기능만 꺼내 쓴다. 내가 코드를 실행하고, 라이브러리는 그저 나를 도와주는 조력자다.”

# 7. 예시 모음

```js
// 데이터 가공 (Lodash)
import _ from 'lodash';
_.shuffle([1, 2, 3, 4]);

// HTTP 통신 (Axios)
import axios from 'axios';
await axios.get('/api/users');

// 날짜 처리 (Dayjs)
import dayjs from 'dayjs';
dayjs().add(1, 'day').format('YYYY-MM-DD');

// 입력값 검증 (Zod)
import { z } from 'zod';
const UserSchema = z.object({ name: z.string(), age: z.number() });
```
