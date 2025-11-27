# 배열 메서드 - some

_구분_
🧪 조건 검사(존재 여부)

_실무 비율_
⭐⭐⭐⭐⭐

_설명_
배열을 순회하며 콜백 함수가 true를 반환하는 요소가 하나라도 있으면 true를 반환한다.
단 하나라도 조건을 만족하면 즉시 종료하기 때문에 빠르다.
모두 실패하면 false를 반환한다.

“해당 조건을 만족하는 요소가 존재하는가?”를 묻는 검사용 메서드다.

---

# 기본 문법

```js
array.some((element, index, array) => {
  return 조건식;
});
```

element: 현재 요소
index: 현재 인덱스
array: 원본 배열
반환값: boolean (true / false)
원본 변경: ❌

---

# 기본 예시

```js
const numbers = [1, 3, 5, 8];
const hasEven = numbers.some((n) => n % 2 === 0);

console.log(hasEven); // true
```

💡 짝수가 하나라도 존재하니까 true.

---

# 없는 경우 (false)

```js
const arr = [1, 3, 5];
const hasEven = arr.some((n) => n % 2 === 0);

console.log(hasEven); // false
```

💡 하나도 없으면 false.

---

# 객체 검사 예시

```js
const users = [
  { name: '레온', admin: false },
  { name: '지민', admin: true },
];

const existsAdmin = users.some((u) => u.admin === true);

console.log(existsAdmin); // true
```

💡 특정 권한을 가진 사용자가 하나라도 있는지 체크할 때 강력하다.

---

# 실무 예시 1 - 이메일 중복 체크 (회원가입)

```js
const users = [{ email: 'a@test.com' }, { email: 'b@test.com' }];

const newEmail = 'a@test.com';

const isDuplicated = users.some((u) => u.email === newEmail);

console.log(isDuplicated); // true
```

💡 실무에서 이 패턴은 100% 쓰인다. “이미 존재하는지?” 검사.

---

# 실무 예시 2 - 권한(roles) 검증

```js
const roles = ['USER', 'MANAGER', 'ADMIN'];
const required = 'ADMIN';

const hasPermission = roles.some((r) => r === required);

console.log(hasPermission); // true
```

💡 JWT나 RBAC 권한 시스템에서 빈출 로직.

---

# 실무 예시 3 - 금지어 필터링

```js
const forbidden = ['욕설1', '금지단어', '불건전'];
const text = '이 문장은 금지단어를 포함하고 있습니다';

const containsForbidden = forbidden.some((word) => text.includes(word));

console.log(containsForbidden); // true
```

💡 채팅, 게시판, 리뷰 시스템에서 검열/필터링 로직으로 흔함.

---

# 실무 예시 4 - React 유효성 검사

```jsx
const fields = [name, email, password];

const hasEmpty = fields.some((f) => !f);

return <button disabled={hasEmpty}>회원가입</button>;
```

💡 입력값 중 하나라도 비어 있으면 버튼 비활성화.

---

# 추가 정보

- some은 “존재 여부 체크”에 최적화된 메서드다.
- 하나만 true여도 즉시 종료하므로 빠르고 효율적이다.
- filter보다 훨씬 가벼운 용도 → “찾는 게 하나라도 있으면 끝”이면 무조건 some이 맞다.
- 문자열 includes()와 함께 조합하면 강력한 검사 로직이 된다.
- some은 true/false만 반환하므로 조건문(if)과 궁합이 좋다.
