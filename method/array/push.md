# 배열 메서드 - push

_구분_
📥 배열 뒤에 요소 추가 (파괴적)

_실무 비율_
⭐⭐⭐⭐

_설명_
배열의 맨 뒤에 새로운 요소를 추가한다.
가장 큰 특징은 원본 배열이 직접 변경된다는 점이다.
반환값은 “추가된 후 배열의 길이(length)”이다.

---

# 기본 문법

```js
array.push(element1, element2, ...);
```

원본 변경: ⛔ (배열을 직접 수정)
반환값: 수정된 후의 배열 length

---

# 기본 예시

```js
const arr = [1, 2];
const len = arr.push(3);

console.log(arr); // [1, 2, 3]
console.log(len); // 3
```

💡 push는 새 배열을 반환하지 않고, length를 반환한다.

---

# 여러 개 추가하기

```js
const arr = [1, 2];
arr.push(3, 4, 5);

console.log(arr); // [1, 2, 3, 4, 5]
```

---

# 객체 추가 예시

```js
const users = [];

users.push({ name: '레온', age: 25 });
users.push({ name: '지민', age: 30 });

console.log(users); // [{...}, {...}]
```

💡 서버에서 응답을 받아 배열로 관리할 때 자주 쓰인다.

---

# 실무 예시 1 - 로그 누적하기

```js
const logs = [];

logs.push('서버 시작');
logs.push('DB 연결 성공');

console.log(logs); // ["서버 시작", "DB 연결 성공"]
```

💡 노드 서버에서 상태 메시지를 “쌓아두는” 방식에 자연스럽다.

---

# 실무 예시 2 - 백엔드에서 동적 목록 구축

```js
const ids = [1, 2];

if (newId) {
  ids.push(newId);
}

console.log(ids);
```

💡 단순 누적에는 push가 제일 직관적이다.

---

# 실무 예시 3 - React에서 절대 금지되는 패턴

```jsx
// ❌ 비추천 (원본 변경)
state.items.push(newItem);
setItems(state.items);
```

💡 원본을 파괴하면 React의 상태 감지가 깨지기 때문에 push 금지.

```jsx
setItems((prev) => [...prev, newItem]); // 불변성 유지
```

💡 정석은 이렇게 해야 한다.

---

# 실무 예시 4 - queue처럼 사용 (뒤에 추가)

```js
const queue = [];

queue.push('A');
queue.push('B');

console.log(queue); // ["A", "B"]
```

💡 push + shift 조합은 큐(Queue) 자료구조를 구현할 때 쓰인다.

---

# 실무 예시 5 - Prisma/DB 응답 병합

```js
const results = [];

for (const page of pages) {
  const data = await prisma.post.findMany({ where: { page } });
  results.push(...data);
}

console.log(results);
```

💡 여러 페이지 데이터를 하나의 배열로 합칠 때 흔히 사용.

# push와 concat 비교

push → 원본 변경 ⛔
concat → 새 배열 반환 ✔️

💡 원본을 지켜야 하는 상황이면 concat 또는 스프레드([...arr])를 사용한다.

---

# 추가 정보

- push는 단순 누적에서 가장 빠르고 직관적이다.
- 하지만 원본을 파괴하므로 “불변성”이 필요한 코드에서는 절대 쓰면 안 된다.
- push의 반환값이 length라는 점을 기억하면 루프 내부에서 유용하게 쓸 수 있다.
- 여러 개를 한 번에 넣을 수 있고, 스프레드 구문을 활용하면 배열을 펼쳐 넣는 것도 가능하다.
- 백엔드/스크립트 로직에서는 엄청 흔하지만, React/함수형 스타일에서는 거의 금지에 가깝다.
