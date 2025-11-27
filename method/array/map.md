# 배열 메서드 - map

_구분_
🔄 데이터 변환

_실무 비율_
⭐⭐⭐⭐⭐

_설명_
배열의 모든 요소를 순회하면서, 콜백 함수의 결과값으로 구성된 새 배열을 반환하는 메소드다.
즉, “배열을 변형(transform)”할 때 쓰인다. 원본 배열은 그대로 유지하고, 새 배열을 만든다.

---

# 기본 문법

```js
array.map((element, index, array) => {
  // 반환값이 새 배열의 요소가 됨
});
```

element: 현재 순회 중인 요소
index: 현재 인덱스
array: 원본 배열 자체
반환값: 새 배열 (콜백의 결과값들로 구성됨)
원본 변경: ❌ (불변)

---

# 기본 예시

```js
const numbers = [1, 2, 3];
const doubled = numbers.map((n) => n * 2);

console.log(doubled); // [2, 4, 6]
console.log(numbers); // [1, 2, 3] (원본 유지)
```

💡 각 요소를 2배로 만들어 새 배열을 반환한다.

---

# 인덱스 활용 예시

```js
const fruits = ['apple', 'banana', 'cherry'];
const labeled = fruits.map((fruit, i) => `${i + 1}. ${fruit}`);

console.log(labeled); // ["1. apple", "2. banana", "3. cherry"]
```

💡 index를 활용해 번호나 순서를 붙일 수 있다.

---

# 객체 변환 예시

```js
const users = [
  { name: '레온', age: 25 },
  { name: '지민', age: 30 },
];

const names = users.map((u) => u.name);

console.log(names); // ["레온", "지민"]
```

💡 특정 프로퍼티만 추출할 때 자주 사용. (API 응답에서 필요한 값만 뽑을 때 매우 흔함)

---

# 실무 예시 1 - API 데이터 가공

```js
const apiResponse = [
  { id: 1, title: '게시글1', views: 100 },
  { id: 2, title: '게시글2', views: 250 },
];

const titles = apiResponse.map((post) => post.title);
console.log(titles); // ["게시글1", "게시글2"]
```

💡 API 응답에서 원하는 필드만 추출 할 때 가장 많이 쓰인다.

---

# 실무 예시 2 - DOM 데이터 변환 (프론트엔드)

```js
const buttons = document.querySelectorAll('button');
const texts = Array.from(buttons).map((btn) => btn.textContent);

console.log(texts);
```

💡 NodeList → 배열 변환 후 map()으로 처리하는 패턴이다.
💡 React나 Vanilla JS 모두에서 자주 쓰인다.

---

# 실무 예시 3 - 숫자 시퀀스 가공

```js
const scores = [60, 70, 80, 90];
const grades = scores.map((s) => (s >= 80 ? '합격' : '불합격'));

console.log(grades); // ["불합격", "불합격", "합격", "합격"]
```

💡 조건을 기반으로 변환 할 때도 깔끔하게 표현 가능하다.

---

# 실무 예시 4 - JSX 렌더링 (React)

```jsx
const users = ['레온', '지민', '유라'];

return (
  <ul>
    {users.map((name, i) => (
      <li key={i}>{name}</li>
    ))}
  </ul>
);
```

💡 React에서 리스트 렌더링(map)은 거의 필수 문법이다.
💡 JSX에서는 반복문 대신 map()을 사용한다.

---

# 추가 정보

- 주요 사용처: 데이터 가공, 필드 추출, 렌더링 예시: API, UI 등
- 대체/혼동 주의: forEach()
- 비동기 처리: Promise.all()과 함께 쓸 수 있다.
