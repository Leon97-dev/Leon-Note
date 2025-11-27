# 배열 메서드 - with

_구분_
🧩 비파괴적 요소 교체(update)

_실무 비율_
⭐⭐⭐

_설명_
배열의 특정 인덱스의 값을 새 값으로 교체한 새로운 배열을 반환한다.
원본 배열은 절대 변경되지 않는다.

```js
arr.with(i, newValue) === [...arr.slice(0, i), newValue, ...arr.slice(i + 1)];
```

---

# 기본 문법

```js
array.with(index, newValue);
```

반환값: 해당 index만 교체된 새 배열
원본 변경: ❌ (절대 안전!)

---

# 기본 예시

```js
const arr = [1, 2, 3];

const updated = arr.with(1, 99);

console.log(updated); // [1, 99, 3]
console.log(arr); // [1, 2, 3] (원본 유지)
```

---

# 음수 인덱스 가능

```js
const arr = [1, 2, 3];

console.log(arr.with(-1, 7)); // [1, 2, 7]
```

💡 -1은 “마지막 요소”라는 뜻.

---

# 실무 예시 1 — React 상태 업데이트(최강!)

```jsx
// ❌ 금지: 원본 파괴
// items[2] = newItem;

// ✔️ 정답
const newItems = items.with(2, newItem);
setItems(newItems);
```

💡 불변성 유지 + 의도 명확. 가독성 최고.

---

# 실무 예시 2 - Prisma/DB 응답에서 특정 데이터 수정

```js
const users = await prisma.user.findMany();
const updated = users.with(0, { ...users[0], active: true });
```

💡 기존 데이터는 그대로, 특정 요소만 업데이트.

---

# 실무 예시 3 - UI 리스트에서 항목 교체

```js
const rows = [{ id: 1 }, { id: 2 }, { id: 3 }];

const replaced = rows.with(1, { id: 99 });

console.log(replaced); // [{id:1},{id:99},{id:3}]
```

---

# 실무 예시 4 - Todo 수정

```js
const todos = ['A', 'B', 'C'];

const updated = todos.with(1, '수정된 Todo');

console.log(updated); // ["A", "수정된 Todo", "C"]
```

---

# 실무 예시 5 - 음수 index로 끝 요소 교체

```js
const items = [10, 20, 30];

const newArr = items.with(-1, 999);

console.log(newArr); // [10, 20, 999]
```

💡 훨씬 읽기 좋고 의도가 명확하다.

---

# 추가 정보

- with()는 “배열의 특정 요소만 바꾸고 싶다”면 가장 쉬운 방법.
- splice/toSpliced보다 훨씬 가독성이 좋고 의도가 명확하다.
- 음수 인덱스 지원으로 마지막 요소 교체가 자연스럽다.
- 불변성을 엄격히 지키는 환경(React, 상태관리 라이브러리, 함수형 코드)에서 특히 강력하다.
- Node 20+, 최신 브라우저에서 기본 지원되는 현대적인 메서드다.
