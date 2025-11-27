# 문자열 메서드 - endsWith

_구분_
🔎 접미사(suffix) 검사

_실무 비율_
⭐⭐⭐⭐

_설명_
문자열이 특정 문자열로 끝나면 true, 아니면 false를 반환한다.
필요하면 “문자열 길이를 임의로 자른 상태에서 검사할 수도 있다.”
원본은 변하지 않는다.

---

# 기본 문법

```js
string.endsWith(searchString, length?);
```

searchString: 끝에서 검사할 문자열
length: 문자열을 앞에서부터 length 길이만큼 잘라 그 범위에서만 검사
반환값: boolean
원본 변경: ❌

---

# 기본 예시

```js
console.log('profile.png'.endsWith('.png')); // true

console.log('profile.png'.endsWith('.jpg')); // false
```

---

# length 활용 (조건부 검사)

```js
const code = 'ABC-1234';

console.log(code.endsWith('C', 3)); // true (앞에서 3글자 → "ABC")
```

💡 특정 길이까지만 잘라서 검사하는 고급 기능.

---

# 대소문자 구분됨

```js
console.log('Hello'.endsWith('LO')); // false

// 필요하면 toLowerCase()와 조합
'Hello'.toLowerCase().endsWith('lo'); // true
```

---

# 실무 예시 1 - 파일 확장자 검증

```js
const file = 'avatar.jpeg';

if (file.endsWith('.jpeg') || file.endsWith('.jpg')) {
  console.log('허용된 이미지입니다.');
}
```

💡 이미지 업로드 검증의 핵심 패턴.

---

# 실무 예시 2 - URL 패턴 체크

```js
const url = '/users/123/edit';

if (url.endsWith('/edit')) {
  console.log('편집 페이지입니다.');
}
```

💡 Next.js, Express, Router에서 꽤 자주 쓰인다.

---

# 실무 예시 3 - 특정 코드 규칙 검사

```js
const productId = 'ITEM-0001';

console.log(productId.endsWith('0001')); // true
```

💡 ERP/쇼핑몰/백오피스 코드에 흔한 패턴.

---

# 실무 예시 4 - 로그 레벨 판별 (특정 문구로 끝나는 경우)

```js
const log = 'DB Connection success [OK]';

if (log.endsWith('[OK]')) {
  console.log('성공 로그입니다.');
}
```

---

# 실무 예시 5 - 문자열 정리 + 조합

```js
const email = 'leon@test.com'.trim();

if (!email.endsWith('@test.com')) {
  throw new Error('사내 이메일이 아닙니다.');
}
```

💡 회사 내부 도메인 검사 패턴.

---

# startsWith vs endsWith vs includes

startsWith → 접두사 검사
endsWith → 접미사 검사
includes → 문자열 내부 포함 여부

💡 필요에 따라 3개를 조합하면 검사 로직이 깔끔해진다.

---

# 추가 정보

- endsWith는 파일·URL·코드 패턴처럼 “끝부분이 규칙인 데이터"에서 유용하다.
- 대소문자 구분이 기본이라, 사용자 입력 기반의 검증에서는 toLowerCase() 조합이 거의 필수.
- length를 사용하면 복잡한 부분 검사까지 처리 가능.
- includes보다 의도가 명확해서 가독성이 훨씬 좋아진다.
- startsWith와 함께 쓰면 문자열의 구조를 안정적으로 검증할 수 있다.
