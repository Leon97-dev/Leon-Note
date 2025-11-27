# Prisma Schema 10가지 규칙

**< 1. 기본 구조 >**
Prisma 스키마는 schema.prisma 파일 안에 정의하며 세 가지 섹션으로 구성된다.

- generator: Prisma Client를 어떤 언어로 생성할지 (JS, TS 등)
- datasource: 데이터베이스 연결 설정 (provider, url)
- model: 테이블 구조 정의

**< 2. 모델 작성 규칙 >**
`이름 규칙`

- 모델명: 단수형, PascalCase (User, Product, Article)
- 필드명: camelCase (createdAt, isDeleted)
- ENUM: 대문자 스네이크형 (enum ROLE_TYPE { ADMIN USER GUEST })

`타입 규칙`

- Prisma 기본 타입: String, Int, BigInt 등등
- Optional 필드 타입: ? (nullable)
- 배열 타입: [] (1:N 관계, 예: posts Post[])
- ID 필드 타입: 반드시 @id 지정 기본값은 @default(autoincrement())

**< 3. 관계(Relation) 정의 >**
`1:1 관계`

```prisma
model User {
  id       Int     @id @default(autoincrement())
  profile  Profile?
}

model Profile {
  id     Int  @id @default(autoincrement())
  user   User @relation(fields: [userId], references: [id])
  userId Int  @unique
}
```

`1:N 관계`

```prisma
model User {
  id    Int     @id @default(autoincrement())
  posts Post[]
}

model Post {
  id      Int  @id @default(autoincrement())
  user    User @relation(fields: [userId], references: [id])
  userId  Int
}
```

`N:M 관계`

```prisma
model Post {
  id       Int      @id @default(autoincrement())
  tags     Tag[]    @relation("PostTags")
}

model Tag {
  id       Int      @id @default(autoincrement())
  posts    Post[]   @relation("PostTags")
}
```

**< 4. 제약 조건 >**

- @unique: 중복 금지
- @default(...): 기본값 설정
  \_ 숫자: @default(0)
  \_ 문자열: @default("guest")
  \_ 날짜: @default(now())
  \_ uuid: @default(uuid())
- @updatedAt: 자동으로 수정시간 기록
- @map("column_name"): 실제 DB 컬럼명 변경 시 사용

**< 5. ENUM 정의 >**

```prisma
enum User_Role {
  ADMIN
  USER
  GUEST
}
```

"대문자 + 언더바"로 구분, 실제 DB엔 문자열로 저장됨, 타입 안전한 조건문이나 필터링 시 유용

**< 6. 네이밍 패턴 (실무 팀 표준) >**

- createdAt, updatedAt → 항상 추가
- 논리삭제 컬럼은 isDeleted Boolean @default(false)
- 외래키는 userId, postId처럼 단수형 + Id
- @relation() 옵션은 명시적으로 써주는 게 안전함 (특히 다중 관계일 때)

**< 7. 네이밍 패턴 (실무 팀 표준) >**

1. 모델 이름 (엔티티 중심으로)
2. 주요 식별자 (id, uuid)
3. 핵심 속성들 (title, email, price 등)
4. 관계 필드 (userId, groupId)
5. 관리용 필드 (createdAt, updatedAt, isDeleted)

**< 8. 실수 방지 체크리스트 >**

- @relation()에 fields와 references 빠뜨리지 않기
- ENUM 수정 시 npx prisma migrate dev --name update-enum 필수
- 필드 이름 바꿀 때 기존 데이터 손실 주의
- Json 타입은 Prisma Studio에서 바로 수정 불가 (직접 쿼리 필요)

**< 9. 마이그레이션 및 클라이언트 >**

```bash
npx prisma migrate dev --name init
npx prisma generate
```

모델 수정 후 반드시 migrate + generate
마이그레이션 이름은 의미 있게 (add-user-role, update-product-price)

**< 10. 추천 구조 예시 (백엔드 기준) >**

```prisma
model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  name      String?
  role      UserRole  @default(USER)
  posts     Post[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Post {
  id        Int       @id @default(autoincrement())
  title     String
  content   String?
  author    User      @relation(fields: [authorId], references: [id])
  authorId  Int
  createdAt DateTime  @default(now())
}
```
