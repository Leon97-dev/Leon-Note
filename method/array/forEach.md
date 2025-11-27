# 배열 메서드 - forEach

_구분_
🔁 단순 반복(iteration)

_실무 비율_
⭐⭐⭐

_설명_
배열의 모든 요소를 순회하며 콜백 함수를 실행한다.
다만 이 메서드는 항상 undefined를 반환하며, 새로운 배열을 만들지도 않는다.
따라서 “반복하면서 부수효과(side effect)가 필요한 경우”에만 적합하다.

`대표적인 부수효과`

- 콘솔 출력
- DOM 조작
- 외부 변수 변경
- API 요청
- 누적 변수 업데이트

---

# 기본 문법

```js
array.forEach((element, index, array) => {
  // 요소마다 실행할 로직
});
```

element: 현재 요소
index: 현재 인덱스
array: 원본 배열
반환값: 없음(undefined)
원본 변경: ❌ (단, 콜백 안에서 직접 바꾸면 변경됨)

---

# 기본 예시

```js
const numbers = [1, 2, 3];

numbers.forEach((n) => {
  console.log(n);
});
```

💡 단순 반복. 반환값은 없다.

---

# index 활용

```js
const fruits = ['apple', 'banana', 'cherry'];

fruits.forEach((f, i) => {
  console.log(`${i + 1}번째 과일: ${f}`);
});
```

---

# forEach vs map 비교

```js
const arr = [1, 2, 3];

const result = arr.forEach((n) => n * 2);
console.log(result); // undefined
```

💡 map처럼 변환하고 싶으면 무조건 map 사용해야 한다.

---

# 객체 배열 순회

```js
const users = [
  { name: '레온', age: 25 },
  { name: '지민', age: 30 },
];

users.forEach((u) => {
  console.log(`${u.name} / ${u.age}`);
});
```

💡 로그를 찍거나 단순 반복이 필요할 때 적합.

---

# 실무 예시 1 - 합산(하지만 reduce가 더 적절)

```js
let sum = 0;
[10, 20, 30].forEach((n) => {
  sum += n;
});

console.log(sum); // 60
```

💡 동작은 하지만 reduce가 더 정석이므로 팀에 따라 선호가 갈린다.

---

# 실무 예시 2 - DOM 반복 처리

```js
const buttons = document.querySelectorAll('button');

buttons.forEach((btn) => {
  btn.classList.add('active');
});
```

💡 요소마다 클래스 추가 등 단순 조작에서 많이 쓰인다.

---

# 실무 예시 3 - 백엔드에서 로그 출력

```js
orders.forEach((order) => {
  console.log('[주문 로그]', order.id, order.total);
});
```

💡 반복하며 콘솔이나 로깅 도구로 기록할 때 자연스럽다.

---

# 실무 예시 4 - 외부 API 여러 번 호출

```js
const ids = [1, 2, 3];

ids.forEach(async (id) => {
  const res = await fetch(`/users/${id}`);
  console.log(await res.json());
});
```

💡 병렬 호출 패턴. (단, await with forEach는 주의가 필요 → Promise.all이 더 정석.)

---

# 실무 예시 5 - React: setState 반복 업데이트 금지 사례

```jsx
// ❌ 비추천
items.forEach((item) => {
  setCount((prev) => prev + item.value);
});
```

💡 반복 중 다중 setState는 비효율적이라 주의해야 한다.

---

# 추가 정보

- forEach는 반환값이 필요 없는 단순 반복에 적합하다.
- 배열 변환(map), 필터링(filter), 찾기(find)는 forEach로 하면 비효율적이다.
- async/await와 함께 쓸 때는 조심 → 순서를 기다리지 않는다.
- break/continue가 없다 → 반드시 전체를 돈다.
- map/filter/reduce처럼 “함수형 스타일” 작업에는 잘 어울리지 않는다.
