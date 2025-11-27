# Node.js 내장 모듈 — crypto

_참고 사이트_
https://nodejs.org/api/crypto.html

1️⃣ 개요
암호화, 해시, 토큰 생성, 디지털 서명 등 보안 관련 기능을 제공하는 Node.js 내장 모듈이다.
암호 알고리즘(OpenSSL 기반)을 사용해,
비밀번호 해시, 토큰 생성, 파일 무결성 검증 등을 안전하게 수행할 수 있다.

import crypto from 'crypto'; ❌ 설치 불필요

2️⃣ 주요 기능

- 문자열/파일 해시(hash) 생성 (SHA256, SHA512 등)
- 비밀번호 암호화 및 검증 (salt + hash)
- 랜덤 값(random bytes) 생성
- HMAC (공유키 기반 해시)
- 대칭키/비대칭키 암호화 (AES, RSA 등)

3️⃣ 해시(Hash) 생성
데이터를 고정된 길이의 암호화된 문자열로 변환한다.
주로 비밀번호 저장, 파일 무결성 검증에 사용된다.

```js
const hash = crypto.createHash('sha256').update('leon1234').digest('hex');
console.log(hash);
// e.g. "b96b8e6d8f8e8c..."
```

- `createHash(알고리즘)`: 해시 알고리즘 선택 (md5, sha1, sha256, sha512 등)
- `update(문자열)`: 해싱할 데이터 입력
- `digest(인코딩)`: 출력 형식 지정 (hex, base64 등)

비밀번호 해시에는 md5, sha1은 취약하므로 사용 금지다.
sha256 이상 또는 **bcrypt(외부 라이브러리)** 권장한다.
**사실 해쉬는 실무에서 외부 라이브러리 위주로 쓰인다.**

4️⃣ 랜덤 값 생성 (Random Bytes)

JWT 토큰, 인증코드, 세션 키 등 예측 불가능한 문자열을 생성한다.

```js
const token = crypto.randomBytes(16).toString('hex');
console.log(token);
// 예: "9f4a2b6cfe9c438b97b7e2d4b3f0b2ff"
```

- 인자값 (byte 길이): 생성할 바이트 수 (16 → 32자리 hex 문자열)
- toString('hex'): 사람이 읽을 수 있게 16진수 문자열로 변환
- randomBytes 말고도 많은 옵션이 있다. **특히 randomUUID 이름 중복 방지!**

5️⃣ HMAC (공유키 기반 해시)

공유키를 이용해 해시를 만들고, 데이터 무결성을 보장한다.
보통 API 요청 서명이나 Webhook 검증에 쓰인다.

```js
const secret = 'super_secret_key';
const message = 'user_id=123';

const hmac = crypto.createHmac('sha256', secret).update(message).digest('hex');
console.log(hmac);
```

서버와 클라이언트가 같은 secret을 공유하고 있다면,
이 HMAC 값을 비교해서 데이터 변조 여부를 검증할 수 있다.

6️⃣ 비밀번호 해시 (Salt + Hash)

단순 해시만으로는 안전하지 않다.
Salt를 랜덤으로 추가하면 동일한 비밀번호라도 해시가 달라져 보안이 강화된다.

```js
const salt = crypto.randomBytes(16).toString('hex');
const hash = crypto
  .pbkdf2Sync('leon1234', salt, 10000, 64, 'sha512')
  .toString('hex');

console.log('salt:', salt);
console.log('hash:', hash);
```

- 'leon1234': 원문 비밀번호
- salt: 랜덤 문자열
- 10000: 반복 횟수(높을수록 안전하지만 느림)
- 64: 출력 길이 (byte 단위)
- 'sha512': 해시 알고리즘

이때 데이터베이스에는 salt와 hash 둘 다 저장하고,
로그인 시 동일한 방식으로 해시를 비교하면 된다.

7️⃣ 대칭키 암호화 (AES)

같은 키로 암호화와 복호화를 모두 수행한다.

```js
const key = crypto.randomBytes(32); // 256비트 키
const iv = crypto.randomBytes(16); // 초기화 벡터

const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
let encrypted = cipher.update('secret message', 'utf8', 'hex');
encrypted += cipher.final('hex');

console.log('Encrypted:', encrypted);

// 복호화
const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');

console.log('Decrypted:', decrypted);
```

AES는 빠르지만 키 관리가 중요하다.
서버 간 공유 시 환경변수로 보호해야 한다.

8️⃣ 비대칭키 암호화 (RSA)

공개키(public)와 비밀키(private)를 따로 사용한다.
JWT 서명, 인증서, SSH 등에서 사용되는 구조다.

```js
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

const message = 'Hello Leon!';
const encrypted = crypto.publicEncrypt(publicKey, Buffer.from(message));
const decrypted = crypto.privateDecrypt(privateKey, encrypted);

console.log('복호화:', decrypted.toString());
```

RSA는 “공개키로 암호화 → 개인키로 복호화” 구조다.
인증서 검증이나 JWT 서명에 자주 사용된다.

9️⃣ 실무 활용 예시

**< 비밀번호 저장용 유틸 함수 >**

```js
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
  return { salt, hash };
}

export function verifyPassword(password, salt, hash) {
  const newHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
  return newHash === hash;
}
```

**< 토큰 생성기 >**

```js
export function generateToken(size = 16) {
  return crypto.randomBytes(size).toString('hex');
}
```
