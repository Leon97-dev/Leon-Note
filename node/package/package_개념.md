# 패키지(Package) 개념

1️⃣ 정의

하나 이상의 모듈(Module)을 묶어서 배포할 수 있게 만든 단위이다.
보통 package.json 파일을 통해 이름, 버전, 의존성 등을 정의하고,
npm(Node Package Manager)을 통해 설치·배포된다.
**“패키지 = 코드 묶음 + 설정 정보 + 메타데이터”**

2️⃣ 구조 예시

```bash
my-app/
 ├─ node_modules/       # 설치된 외부 패키지들
 ├─ src/
 │   └─ index.js        # 내 코드 (내부 모듈)
 ├─ package.json        # 패키지 설정 파일
 └─ package-lock.json   # 의존성 잠금 파일
```

이때 my-app 자체도 하나의 패키지다.
npm에 올리면 전 세계 개발자가 npm install my-app으로 설치 가능하다.

3️⃣ package.json의 역할

프로젝트의 “정보와 의존성”을 관리하는 핵심 파일이다.

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "description": "레온의 Node.js 예제 프로젝트",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  },
  "dependencies": {
    "express": "^4.19.0",
    "prisma": "^5.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

**< 주요 속성 >**

- `name`: 패키지 이름 (npm 배포 시 고유)
- `version`: 버전 번호 (SemVer 규칙 따름)
- `description`: 패키지 설명
- `main`: 진입 파일 (import 시 불러지는 파일)
- `scripts`: npm 명령어 스크립트 정의
- `dependencies`: 실행 시 필요한 외부 패키지
- `devDependencies`: 개발용 의존성 (빌드, 테스트 등)

4️⃣ npm(Node Package Manager)

npm은 Node.js의 공식 패키지 관리자다.
패키지 설치, 업데이트, 삭제, 배포를 담당한다.

- `npm init`: 새 프로젝트 초기화 (package.json 생성)
- `npm install <패키지명>`: 패키지 설치
- `npm install -D <패키지명>`: 개발용(dev) 의존성 설치
- `npm uninstall <패키지명>`: 패키지 제거
- `npm update`: 패키지 업데이트
- `npm run <스크립트명>`: package.json의 script 실행
- `npm publisht`: 패키지 npm 등록(배포)
- `npm list`: 설치된 패키지 목록 출력

5️⃣ 버전 규칙 (SemVer)

npm은 Semantic Versioning(의미 있는 버전 규칙) 을 따른다.

`MAJOR.MINOR.PATCH`

- `MAJOR`: 큰 변경 (하위 호환 X), 1.0.0 → 2.0.0
- `MINOR`: 기능 추가 (하위 호환 O), 1.0.0 → 1.1.0
- `PATCH`: 버그 수정 (기능 동일), 1.0.0 → 1.0.1

npm 설치 시 `^, ~` 기호로 버전 범위를 지정할 수 있다.

- `^1.2.3`: 1.x.x까지 자동 업데이트 허용
- `~1.2.3`: 1.2.x까지만 자동 업데이트
- `1.2.3`: 고정 버전 (업데이트 없음)

6️⃣ 패키지의 종류

- `내부 패키지(Local)`: 프로젝트 내부에서만 사용
  \_ src/ 내의 모듈

- `외부 패키지(External)`: npm으로 설치
  \_ express, axios, dotenv

- `전역 패키지(Global)`: 시스템 전체에서 사용 (-g 옵션)
  \_ nodemon, pm2, prisma CLI

- `개인 패키지(Published)`: 직접 만든 코드 npm 배포
  \_ @leon-dev/utils

7️⃣ package-lock.json

npm이 실제 설치한 패키지의 정확한 버전 정보를 기록
팀원 간 의존성 버전 불일치 방지
CI/CD 환경에서도 동일 버전 보장
**절대 수동 수정 금지 — npm이 자동으로 관리한다.**
