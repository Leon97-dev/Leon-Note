# Prisma CLI 명령어 정리

# 프로젝트 초기 설치

1. Prisma 설치

npm install prisma --save-dev
npm install @prisma/client

2. Prisma 초기화

npx prisma init

3. .env 설정

DATABASE_URL="postgresql://leon:password@localhost:5432/seven_dev?schema=public"

- 스키마 이름(?schema=public)은 보통 프로젝트 이름으로 바꿔둠 (?schema=seven 등)

4. 버전 확인

npx prisma -v

5. 버전 통일

npm install prisma@6.18.0 @prisma/client@6.18.0

- 양 쪽 버전이 맞아야 에러가 안난다.

# DB 생성 및 마이그레이션

npx prisma migrate dev --name init

- 새 데이터베이스와 테이블 자동 생성
- prisma/migrations/ 폴더에 버전별 SQL 기록됨
- 이름(--name init)은 마이그레이션 목적을 간단히 표현 (add-user-table, update-record-model 등)

npx prisma generate

- 스키마 변경 후에는 항상 generate를 다시 실행해야 함

# Prisma Studio (데이터 GUI)

npx prisma studio

- 브라우저에서 DB 데이터를 직접 확인/수정
- http://localhost:5555 자동 오픈

# 마이그레이션 변경

npx prisma migrate dev --name update-record

- 모델 수정 후 DB 구조 반영
- dev 모드에서는 기존 마이그레이션 히스토리 유지하면서 새 버전 추가

# DB 가져오기

npx prisma db pull

- 이때 에러가 뜬다면 Prisma가 읽고 있는 URL이 화면에 적나라하게 나온다.

# DB 리셋 (모든 데이터 삭제 후 초기화)

npx prisma migrate reset

- 개발 중 스키마가 꼬였거나 테스트 데이터 초기화할 때 사용
- 모든 데이터 지워지니 실무 DB에서는 절대 금지
- 뒤에 `--force`를 붙이면 강제로 초기화

# 데이터 시드(seed) 실행

npx prisma db seed

- prisma/seed.js 실행해서 초기 데이터 삽입
- 설정 추가 필요 (package.json)
  \_ "prisma": { "seed": "node prisma/seed.js" }

# 실제 배포용 마이그레이션 반영

npx prisma migrate deploy

- CI/CD 파이프라인 또는 서버에서 실행
- 기존 마이그레이션 파일을 그대로 DB에 적용만 함
- 스키마 변경 없이 안정적

# 현재 DB 스키마 미리보기

npx prisma db pull

- 이미 존재하는 DB를 Prisma 모델로 가져오기
- 반대 동작(db push)과 세트로 자주 사용 (비추천)

# 명령어 사용 흐름

npm install prisma @prisma/client
npx prisma init
↓
모델 작성 (schema.prisma)
↓
npx prisma migrate dev --name init
npx prisma generate
↓
npx prisma studio ← 데이터 확인
↓
모델 수정
↓
npx prisma migrate dev --name update
↓
npx prisma db seed ← 초기 데이터 추가
↓
배포 시
npx prisma migrate deploy
