# 배열 메서드 - filter

_구분_
🎚️ 데이터 선별

_실무 비율_
⭐⭐⭐⭐⭐

_설명_
배열의 요소들을 순회하면서 조건을 통과한 요소들만 모아 새 배열을 만드는 메서드다.
조건식이 true인 요소만 남기기 때문에 “필터링(filter)” 작업의 핵심 도구다.
원본 배열은 전혀 수정되지 않는다.

---

# 기본 문법

```js
array.filter((element, index, array) => {
  // true를 반환한 요소만 새 배열에 포함됨
});
```

element: 현재 요소
index: 현재 인덱스
array: 원본 배열
반환값: 조건을 만족하는 요소들로 이루어진 새 배열
원본 변경: ❌ (불변)

---

# 기본 예시

```js
const numbers = [1, 2, 3, 4, 5];
const even = numbers.filter((n) => n % 2 === 0);

console.log(even); // [2, 4]
console.log(numbers); // [1, 2, 3, 4, 5] (원본 유지)
```

💡 조건을 만족하는 숫자만 새 배열로 만든다.

---

# 인덱스 활용 예시

```js
const fruits = ['apple', 'banana', 'avocado', 'blueberry'];
const startsWithA = fruits.filter((f) => f.startsWith('a'));

console.log(startsWithA); // ["apple", "avocado"]
```

💡 index는 잘 쓰이지 않지만, 시작 글자를 기준으로 걸러내는 작업에 자주 쓰인다.

---

# 객체 필터링 예시

```js
const users = [
  { name: '레온', age: 25 },
  { name: '민재', age: 17 },
];

const adults = users.filter((u) => u.age >= 18);

console.log(adults); // [{ name: "레온", age: 25 }]
```

💡 조건을 만족하는 객체만 추출할 때 매우 유용하다.

---

# 실무 예시 1 - API 응답에서 조건 데이터 추출

```js
const posts = [
  { id: 1, title: 'A', published: true },
  { id: 2, title: 'B', published: false },
];

const publishedPosts = posts.filter((p) => p.published);

console.log(publishedPosts); // [{ id: 1, title: "A", published: true }]
```

💡 공개된 글만 보여줄 때, 필터링은 실무에서 매우 흔한 패턴이다.

---

# 실무 예시 2 - 검색 기능 구현

```js
const items = ['apple', 'banana', 'grape', 'orange'];
const keyword = 'a';

const result = items.filter((item) => item.includes(keyword));

console.log(result); // ["apple", "banana", "grape"]
```

💡 부분 문자열 검색(검색창 구현)의 핵심 로직이다.

---

# 실무 예시 3 - DOM 요소 필터링

```js
const buttons = Array.from(document.querySelectorAll('button'));
const dangerButtons = buttons.filter((btn) => btn.classList.contains('danger'));

console.log(dangerButtons);
```

💡 특정 클래스를 가진 요소만 모을 때 자주 쓴다.

---

# 실무 예시 4 - React 조건부 렌더링

```jsx
const users = [
  { name: '레온', active: true },
  { name: '지민', active: false },
];

return (
  <ul>
    {users
      .filter((u) => u.active)
      .map((u, i) => (
        <li key={i}>{u.name}</li>
      ))}
  </ul>
);
```

💡 “활성화된 사용자만 표시" 같은 조건부 렌더링에서 아주 자주 등장하는 조합이다.

---

# 추가 정보

- filter는 조건이 명확할수록 코드가 깔끔해진다.
- 빈 배열이 나와도 에러가 아니다 → 조건을 통과한 요소가 없다면 그냥 []가 반환될 뿐이다.
- 삭제 개념처럼 사용할 수 있다. 예: todos.filter(todo => todo.id !== targetId)
- filter → map 순으로 조합하면 “필터링 + 변환” 구조가 자연스럽게 된다.
- ilter는 항상 새 배열을 반환하므로 원본을 지키는 함수형 스타일에 적합하다.
