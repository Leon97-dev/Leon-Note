# 배열 메서드 - find

_구분_
🔍 단일 요소 탐색

_실무 비율_
⭐⭐⭐⭐⭐

_설명_
배열을 앞에서부터 순회하면서, 조건을 만족하는 첫 번째 요소를 반환한다.
조건을 충족하는 요소를 찾으면 즉시 순회를 멈추기 때문에 효율적이다.
찾지 못하면 undefined를 반환한다.
필터링과 달리 배열이 아닌 단일 값을 찾아내는 데 특화되어 있다.

---

# 기본 문법

```js
array.find((element, index, array) => {
  // true가 되면 해당 element를 즉시 반환
});
```

element: 현재 요소
index: 현재 인덱스
array: 원본 배열
반환값: 조건에 맞는 ‘첫 번째 요소’ 또는 undefined
원본 변경: ❌ (불변)

---

# 기본 예시

```js
const numbers = [1, 3, 5, 7, 8, 9];
const firstEven = numbers.find((n) => n % 2 === 0);

console.log(firstEven); // 8
```

💡 배열 전체가 아니라 조건을 만족하는 ‘첫 요소’만 찾는다.

---

# 없음(undefined) 반환 예시

```js
const arr = [1, 3, 5];
const even = arr.find((n) => n % 2 === 0);

console.log(even); // undefined
```

💡 조건을 만족하지 않으면 반드시 undefined가 나온다.

---

# 객체 탐색 예시

```js
const users = [
  { id: 1, name: '레온' },
  { id: 2, name: '지민' },
  { id: 3, name: '유라' },
];

const target = users.find((u) => u.id === 2);

console.log(target); // { id: 2, name: "지민" }
```

💡 특정 id, email 등 “고유 값” 기준으로 찾을 때 매우 자주 쓰인다.

---

# 실무 예시 1 - 로그인 유저 찾기

```js
const users = [
  { email: 'a@test.com', password: '1234' },
  { email: 'b@test.com', password: '5678' },
];

const loginUser = users.find(
  (u) => u.email === 'a@test.com' && u.password === '1234'
);

console.log(loginUser); // { email: "a@test.com", password: "1234" }
```

💡 find는 “딱 하나를 찾을 때” 가장 깔끔한 도구다.

---

# 실무 예시 2 - API 응답에서 특정 아이디 찾기

```js
const posts = [
  { id: 1, title: 'A' },
  { id: 2, title: 'B' },
];

const post = posts.find((p) => p.id === 2);

console.log(post); // { id: 2, title: "B" }
```

💡 상세 페이지 조회 시, 특정 id의 데이터를 찾는 패턴이다.

---

# 실무 예시 3 - DOM 요소 탐색

```js
const buttons = Array.from(document.querySelectorAll('button'));
const submitBtn = buttons.find((btn) => btn.textContent === '제출');

console.log(submitBtn);
```

💡 텍스트나 속성으로 특정 DOM 요소를 찾을 때 유용하다.

---

# 실무 예시 4 - React 조건 기반 단일 선택

```jsx
const users = [
  { id: 1, name: '레온' },
  { id: 2, name: '지민' },
];

const targetUser = users.find((u) => u.id === selectedId);

return <div>{targetUser?.name}</div>;
```

💡 선택된 한 명의 데이터만 렌더링할 때 find()는 자연스럽다.

---

# 추가 정보

- filter는 “여러 개”, find는 “단 하나” → 용도 구분이 중요하다.
- 찾지 못하면 무조건 undefined → optional chaining(?.)과 함께 쓰면 안전하다.
- find는 조건을 만족하는 순간 즉시 종료하므로 큰 배열에서도 효율적이다.
- ID, email, key처럼 “고유한 값”을 찾는 상황에서 가장 적합하다.
- findIndex()와 짝처럼 사용 가능하다. (요소 대신 인덱스를 찾는 친구)
