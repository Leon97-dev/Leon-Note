# 배열 메서드 - sort

_구분_
📊 정렬(sort)

_실무 비율_
⭐⭐⭐⭐

_설명_
배열을 **문자열 기준(유니코드)**으로 정렬한다.
즉, 별도의 함수를 제공하지 않으면 숫자도 문자열처럼 취급된다.
정렬 기준을 직접 만들고 싶다면 **비교 함수(Comparator)**를 반드시 넣어야 한다.

가장 주의할 점: **원본 배열이 직접 변경(mutating)**된다.

---

# 기본 문법

```js
array.sort((a, b) => {
  return 양수 / 음수 / 0;
});
```

`비교 함수 규칙`
a - b가 음수면 a가 앞
a - b가 양수면 b가 앞
0이면 순서 유지

원본 변경: ⛔ (주의!)
반환값: 정렬된 원본 배열(참조 동일)

---

# 기본 예시 - 문자열 정렬

```js
const fruits = ['banana', 'apple', 'cherry'];

fruits.sort();

console.log(fruits); // ["apple", "banana", "cherry"]
```

💡 문자열 정렬은 기본 sort만으로 충분하다.

---

# 기본 예시 - 숫자 정렬

**< 잘못된 예시 >**

```js
const nums = [10, 2, 30];

nums.sort();

console.log(nums);
// [10, 2, 30] ❌  문자열 기준 정렬 → "10" < "2"
```

💡 숫자는 반드시 비교 함수를 써야 한다.

**< 올바른 예시 >**

```js
const nums = [10, 2, 30];

nums.sort((a, b) => a - b);

console.log(nums); // [2, 10, 30]
```

💡 기본 정렬이 문자열 기준이라는 걸 항상 기억해야 한다.

---

# 내림차순 예시

```js
nums.sort((a, b) => b - a);
```

💡 숫자로 정렬할 땐 a-b or b-a로 외워두면 편하다.

---

# 객체 정렬 예시 - 나이순

```js
const users = [
  { name: '레온', age: 25 },
  { name: '지민', age: 30 },
  { name: '유라', age: 20 },
];

users.sort((a, b) => a.age - b.age);

console.log(users); // age 기준 오름차순 정렬
```

💡 비교 대상이 객체라면 프로퍼티를 지정해 정렬 가능.

---

# 실무 예시 1 - 날짜 정렬

```js
const posts = [
  { title: 'A', createdAt: '2023-12-01' },
  { title: 'B', createdAt: '2023-10-20' },
];

posts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

console.log(posts); // 오래된 날짜 → 최신 날짜 순
```

💡 문자열 날짜는 Date 변환 후 비교해야 안전하다.

---

# 실무 예시 2 - 점수 순위

```js
const scores = [70, 90, 50, 100];

scores.sort((a, b) => b - a);

console.log(scores); // [100, 90, 70, 50]
```

💡 내림차순은 대부분 순위 화면에서 쓰인다.

---

# 실무 예시 3 - 알파벳/한글 정렬 with localeCompare

```js
const names = ['레온', '지민', '유라'];

names.sort((a, b) => a.localeCompare(b));

console.log(names); // 사전식 정렬
```

💡 여러 언어가 섞인 데이터는 localeCompare가 훨씬 정확하다.

---

# 실무 예시 4 - React 리스트 정렬

```js
const words = ['레온', '은', '개발자다'];

const sentence = words.reduce((acc, w) => acc + ' ' + w);

console.log(sentence); // "레온 은 개발자다"
```

💡 단순 텍스트 조합도 가능.

---

# 실무 예시 5 - React: 복잡한 상태 계산

```jsx
const sortedUsers = [...users].sort((a, b) => a.age - b.age);

return (
  <ul>
    {sortedUsers.map((u, i) => (
      <li key={i}>{u.name}</li>
    ))}
  </ul>
);
```

💡 React에서는 원본을 건드리면 안 되므로 반드시 [...배열]로 복사 후 정렬한다.

---

# 추가 정보

- sort는 기본적으로 문자열 비교를 한다 → 숫자는 반드시 비교 함수 필요.
- 원본을 바꾸는 메서드라서 React·함수형 패턴에서는 항상 복사 후 사용.
- localeCompare는 다국어 정렬에서 훨씬 정확한 결과를 준다.
- 비교 함수는 a - b / b - a 패턴을 외우면 80% 해결된다.
- sort는 중요하지만 실수하기 쉬운 메서드라 팀 코드 리뷰에서도 자주 지적된다.
