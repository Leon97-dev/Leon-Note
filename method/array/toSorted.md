# 배열 메서드 - toSorted

_구분_
🧊 비파괴적(non-mutating) 정렬

_실무 비율_
⭐⭐⭐

_설명_
기존 sort()는 원본 배열을 직접 변경해버리는 아주 위험한 메서드다.
그래서 ES2023에서 “원본 유지” 버전이 공식적으로 등장했다.
toSorted()는 원본은 그대로 두고, 정렬된 새 배열을 반환한다.
정렬 기준은 기존 sort와 동일하게 **비교 함수(comparator)**를 사용한다.

```js
arr.toSorted() === [...arr].sort();
```

쉽게 말하면 이걸 한 메서드로 끝내는 느낌이다.

---

# 기본 문법

```js
array.toSorted(compareFn?);
```

compareFn: (a, b) => 숫자(음수/양수/0)
반환값: 정렬된 새 배열
원본 변경: ❌ (안전!)

---

# 기본 예시

```js
const arr = [3, 1, 2];

const sorted = arr.toSorted();

console.log(sorted); // [1, 2, 3]
console.log(arr); // [3, 1, 2]  (원본 유지)
```

💡 sort와 달리 원본이 절대 변하지 않는다.

---

# 숫자 정렬 (올바른 방식)

```js
const nums = [10, 2, 30];

const sorted = nums.toSorted((a, b) => a - b);

console.log(sorted); // [2, 10, 30]
console.log(nums); // [10, 2, 30]
```

💡 원본을 보존하면서 숫자 정렬하는 현대적인 방식.

---

# 객체 정렬

```js
const users = [
  { name: '레온', age: 25 },
  { name: '지민', age: 30 },
  { name: '유라', age: 20 },
];

const sorted = users.toSorted((a, b) => a.age - b.age);

console.log(sorted); // age 기준 오름차순
console.log(users); // 원본 그대로
```

💡 UI 목록 정렬할 때 아주 깔끔하다.

---

# 문자열 정렬

```js
const fruits = ['banana', 'apple', 'cherry'];

const sorted = fruits.toSorted();

console.log(sorted); // ["apple", "banana", "cherry"]
```

---

# 실무 예시 1 - React 상태 정렬 (완전 안전!)

```jsx
const sorted = items.toSorted((a, b) => a.price - b.price);

return (
  <ul>
    {sorted.map((i) => (
      <li key={i.id}>{i.name}</li>
    ))}
  </ul>
);
```

💡 React에서 sort()는 금지에 가까움 → toSorted가 정답.

---

# 실무 예시 2 - Prisma 응답 정렬

```js
const posts = await prisma.post.findMany();

const sorted = posts.toSorted((a, b) => b.views - a.views);
```

💡 원본을 건드리지 말고 정렬해 보여주는 로직에서 아주 자연스럽다.

---

# 실무 예시 3 - 날짜 정렬

```js
const sorted = posts.toSorted(
  (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
);
```

💡 sort()보다 훨씬 안전하고 협업에 적합.

---

# 실무 예시 4 - 다국어 정렬(localeCompare)

```js
const names = ['레온', '유라', '지민'];

const sorted = names.toSorted((a, b) => a.localeCompare(b));
```

💡 대량 삽입은 push보다 훨씬 유연하다.

---

# 추가 정보

- sort()로 인한 버그는 실무에서 매우 잦다 → toSorted가 구조적으로 해결.
- 팀 코딩 스타일이 “불변성”을 중시할수록 toSorted를 적극 사용
- Node 20+, Chrome 110+, 최신 브라우저/런타임에서 기본 지원.
- 대규모 리스트를 정렬할 때 원본을 건드리면 캐싱·메모이제이션이 깨지기 때문에 특히 중요.
- 다른 “새 배열 반환” 계열(toReversed, toSpliced 등)과 함께 쓰면 더 안전한 코드가 된다.
