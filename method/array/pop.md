# 배열 메서드 - pop

_구분_
📤 배열 끝에서 요소 제거 (파괴적)

_실무 비율_
⭐⭐⭐

_설명_
배열의 맨 마지막 요소를 제거하고 반환한다.
원본 배열이 직접 변경되는 파괴적 메서드다.
배열이 비어있다면 undefined를 반환한다.

---

# 기본 문법

```js
const removed = array.pop();
```

반환값: 제거된 마지막 요소
원본 변경: ⛔ (배열을 직접 수정)

---

# 기본 예시

```js
const arr = [1, 2, 3];
const last = arr.pop();

console.log(last); // 3
console.log(arr); // [1, 2]
```

💡 push와 반대 동작.

---

# 비어 있는 배열에서 pop

```js
const arr = [];
console.log(arr.pop()); // undefined
```

💡 에러가 아니라 undefined.

---

# 객체 요소 제거

```js
const users = [{ name: '레온' }, { name: '지민' }];

const removed = users.pop();

console.log(removed); // { name: "지민" }

console.log(users); // [{ name: "레온" }]
```

---

# 실무 예시 1 - 스택(Stack) 구현

```js
const stack = [];

stack.push(1);
stack.push(2);

console.log(stack.pop()); // 2
console.log(stack.pop()); // 1
```

💡 push/pop 조합 → 전형적인 LIFO(Last In First Out)

---

# 실무 예시 2 - 최근 기록 제거

```js
let logs = ['입장', '조회', '결제'];

const lastAction = logs.pop();

console.log(lastAction); // '결제'
console.log(logs); // ['입장', '조회']
```

💡 뒤에서부터 차례로 회수할 때 자연스럽다.

---

# 실무 예시 3 - 백엔드 queue/stack 혼용 상황

```jsx
const buffer = [];

buffer.push(data1);
buffer.push(data2);

// 처리할 때 뒤에서 꺼내기
const current = buffer.pop();
```

💡 버퍼 구조를 간단하게 구현할 때 유용.

---

# 실무 예시 4 - React에서는 거의 금지

```jsx
// ❌ 비추천
state.items.pop();
setItems(state.items);
```

💡 원본을 직접 변경하므로 절대 금지.

```jsx
// 불변성 유지 버전
setItems((prev) => prev.slice(0, -1));
```

---

# push/pop vs shift/unshift

- `스택 구조(뒤 기준)`
  \_ push → 뒤에 추가
  \_ pop → 뒤에서 제거

- `큐 구조(앞 기준)`
  \_ shift → 앞에서 제거
  \_ unshift → 앞에 추가

---

# 추가 정보

- pop은 push와 함께 스택(Stack) 자료구조의 기본이다.
- 배열의 마지막 요소를 반환해준다는 점이 편리하다.
- 원본이 직접 변경되므로 React/상태 관리 환경에서는 다른 방식으로 대체해야 한다.
- 빈 배열에서도 안전하게 동작 → 결과는 undefined.
