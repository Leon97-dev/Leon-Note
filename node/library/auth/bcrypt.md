# bcrypt — 비밀번호 해싱(암호화) 라이브러리

_참고 사이트_
https://github.com/kelektiv/node.bcrypt.js

---

# 1. 개요

bcrypt는 사용자 비밀번호를 단방향 해시(one-way hash) 방식으로 암호화해,
DB에 안전하게 저장하는 라이브러리다.
비밀번호를 절대 원문 그대로 저장하지 않기 위해 필수적으로 사용된다.

npm i bcrypt ✅ 설치 필요

---

# 2. bcrypt가 필요한 이유

bcrypt는 비밀번호 보안의 기본기이자 실무 표준 방식이다.

- 사용자 비밀번호를 그대로 저장하면 보안 대참사
- 해킹 시 DB가 털려도 비밀번호를 복구하기 거의 불가능
- bcrypt는 해시 + salt 방식을 사용
- 공격자가 dictionary/bruteforce 해킹하기 어렵게 설계됨

---

# 3. 주요 기능

- 비밀번호 해싱 (hash)
- 해시 비교 (compare)
- salt 자동 생성
- 암호화 강도 조절 (saltRounds)

---

# 4. 기본 사용법

**< 해시 생성 >**

```js
import bcrypt from 'bcrypt';

const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// 결과
$2b$10$8Oe2qblxfnsqd1dUvAhaNu6O9EXgjSgN4twdC7F3W95m3I2Z3fkuW;
```

절대 원래 비밀번호로 되돌릴 수 없다.

---

# 5. 비밀번호 비교

**< 로그인 시 필수 과정 >**

```js
const isMatch = await bcrypt.compare(inputPassword, user.hashedPassword);

if (!isMatch) {
  throw new Error('비밀번호 불일치');
}
```

compare는 내부적으로 inputPassword → hash 변환 → DB hash와 비교

---

# 6. saltRounds(해시 강도)

```js
bcrypt.hash(password, 10); // 10회 반복(기본)
bcrypt.hash(password, 12); // 보안↑ but 속도↓
```

- `추천 값`
  \_ 개발 환경 → 10
  \_ 운영 환경 → 10~12
  \_ 금융/특수 보안 환경 → 12~14

**너무 높이면 로그인 속도가 느려진다.**

---

# 7. 실무 로그인 흐름

- `회원가입`
  \_ 사용자가 비밀번호 전송
  \_ 서버 → bcrypt.hash()
  \_ DB에 hash 저장 (절대 원본 저장 X)

- `로그인`
  \_ 사용자가 비밀번호 입력
  \_ 서버 → bcrypt.compare()
  \_ 일치하면 로그인 성공

**이 구조가 전 세계 서비스의 기본 패턴이다.**

---

# 8. Prisma와 함께 쓰는 패턴

```js
// 회원가입
const hashed = await bcrypt.hash(password, 10);

await prisma.user.create({
  data: {
    email,
    password: hashed,
  },
});

// 로그인
const isValid = await bcrypt.compare(inputPw, user.password);
```
