# 배열 메서드 - splice

_구분_
🪓 요소 제거 / 삽입 / 교체 (파괴적 메서드)

_실무 비율_
⭐⭐⭐⭐

_설명_
배열의 원하는 위치에서 요소를 삭제하거나, 새 요소를 삽입하거나, 삭제 + 삽입해서 교체까지 가능한 만능 메서드다.
하지만 대가로 원본 배열을 직접 변경한다.

---

# 기본 문법

```js
array.splice(start, deleteCount, item1, item2, ...);
```

start: 시작 인덱스
deleteCount: 삭제할 요소 개수
item1…: 여기에 값이 있으면 삽입/교체, 없으면 제거만
반환값: 삭제된 요소들로 이루어진 배열
원본 변경: ⛔ (파괴형)

---

# 기본 예시 1 - 삭제

```js
const arr = [1, 2, 3, 4];

const removed = arr.splice(1, 2);

console.log(removed); // [2, 3]
console.log(arr); // [1, 4]
```

💡 1번 인덱스부터 2개 삭제.

---

# 기본 예시 2 - 삽입

```js
const arr = [1, 4];

arr.splice(1, 0, 2, 3);

console.log(arr); // [1, 2, 3, 4]
```

💡 deleteCount = 0 → 삭제 없이 삽입.

---

# 기본 예시 3 - 교체

```js
const arr = ['레온', '민재', '지민'];

arr.splice(1, 1, '루시');

console.log(arr); // ["레온", "루시", "지민"]
```

💡 삭제 1개 + 삽입 1개 → 교체.

---

# 음수 인덱스 가능

```js
const arr = [1, 2, 3, 4];

arr.splice(-1, 1);

console.log(arr); // [1, 2, 3]
```

💡 -1은 마지막 요소부터 시작.

---

# 실무 예시 1 - Todo 삭제 로직

```js
const todos = ['A', 'B', 'C'];

const index = todos.indexOf('B');
todos.splice(index, 1);

console.log(todos); // ["A", "C"]
```

💡 특정 요소 제거할 때 자주 쓰이는 조합.

---

# 실무 예시 2 - API 응답에서 특정 인덱스 제거

```js
const posts = await getPosts();

posts.splice(0, 5); // 최신 게시글 5개 제거
```

💡 원본을 가공해서 다시 DB에 넣을 때도 쓰인다(단, 주의 필요).

---

# 실무 예시 3 - UI 리스트에서 항목 교체

```js
const rows = [{ id: 1 }, { id: 2 }, { id: 3 }];

rows.splice(1, 1, { id: 99 });

console.log(rows); // [{id:1}, {id:99}, {id:3}]
```

💡 특정 항목 수정할 때 splice는 직관적이다.

---

# 실무 예시 4 - 대량 삽입

```js
const list = [1, 2, 3];

list.splice(1, 0, 'A', 'B', 'C');

console.log(list); // [1, "A", "B", "C", 2, 3]
```

💡 대량 삽입은 push보다 훨씬 유연하다.

---

# 실무 예시 5 - React에서는 절대 금지

```jsx
// ❌ 금지: 원본을 파괴함
items.splice(1, 1);

// 올바른 방식
setItems((prev) => [...prev.slice(0, 1), ...prev.slice(2)]);
```

💡 불변성을 깨뜨려 상태가 감지되지 않는다.

---

# splice vs slice (헷갈리면 큰일남)

slice → 비파괴 / 부분 복사
splice → 파괴적 / 삭제·삽입·교체

💡 둘은 이름이 비슷하지만 본질이 완전히 다르다.

---

# 추가 정보

- splice는 CRUD 중 Remove·Update·Insert를 모두 해결하는 강력한 도구
- 하지만 원본을 파괴하므로 꼭 필요한 시점에만 사용
- slice로 대체 가능한 경우는 slice 쪽이 더 안전
- 큰 배열에서 splice는 비용이 크다(중간 요소를 밀거나 당겨야 해서)
- 프론트의 상태 관리(React)에서는 splice 금지, 백엔드 데이터 처리에서는 종종 유용
