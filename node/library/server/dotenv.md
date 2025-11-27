# Node.js 외부 라이브러리 - dotenv

_참고 사이트_
https://github.com/motdotla/dotenv

---

# 1. 개요

Node.js 프로젝트에서 환경 변수(environment variables)를 쉽게 불러오는 외부 라이브러리다.
.env 파일에 정의한 변수를 process.env에 자동으로 등록해주며,
비밀번호·API 키·DB URL 같은 민감 정보를 코드에서 분리하도록 돕는다.

npm i dotenv ✅ 설치 필요

---

# 2. 주요 역할

- .env 파일의 key=value 를 읽어서 process.env에 로드
- 코드와 비밀 정보(DB 비밀번호 등)를 분리
- 개발/운영 환경을 나누기 쉽다
- Express·Prisma·JWT 등 모든 백엔드 구성 요소와 함께 사용됨

---

# 3. 기본 사용법

**< 환경 변수 로드 >**

```js
import dotenv from 'dotenv';
dotenv.config();
```

이 코드가 실행되면 프로젝트 루트의 .env 파일이 자동으로 적용된다.

**< .env 파일 예시 >**

```ini
PORT=4000
DATABASE_URL="postgresql://user:pass@localhost:5432/mydb"
JWT_SECRET="supersecret"
```

**< 사용 >**

```js
const port = process.env.PORT;
console.log(port);
```

---

# 4. config() 옵션

**< 특정 파일 지정 >**

```js
dotenv.config({ path: './config/.env.dev' });
```

파일 경로를 직접지정할 수 있어서 개발/운영을 분리할 때 유용하다.

---

# 5. 실무에서 자주 사용되는 패턴

**< config는 app.js 최상단에 두기 >**

```js
import dotenv from 'dotenv';
dotenv.config(); // ← 항상 가장 위, import 아래
```

환경 변수는 앱이 시작되는 순간 로드되어야 하므로 모든 코드보다 먼저 실행되는 것이 원칙이다.

**< 환경별 .env 분리하기 >**

```bash
.env
.env.dev
.env.prod
```

실무 운영 서버에서는 .env.prod만 로드하게 설정한다.

**< config 누락 시 발생하는 문제 >**
거의 모든 “갑자기 undefined가 나오는 오류”의 절반은 dotenv config 누락이다.

- process.env.PORT가 undefined
- Prisma의 DATABASE_URL이 undefined → DB 연결 실패
- JWT_SECRET 없어서 토큰 생성 불가
- S3_KEY, API_KEY 전부 undefined

---

# 6. 자주 하는 실수

- dotenv.config()를 import보다 아래에 둠 → 적용 안 됨
- 파일 이름을 .env로 안 만들고 env.txt 같은 이름으로 저장
- 경로 잘못 지정해서 로드 안 됨
- GitHub에 .env를 올려버림(절대 금지)
- 환경 변수의 값에 따옴표를 잘못 씌움
