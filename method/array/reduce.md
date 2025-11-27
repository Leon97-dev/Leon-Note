# 배열 메서드 - reduce

_구분_
🧱 누적·집계·축약(aggregate)

_실무 비율_
⭐⭐⭐⭐

_설명_
배열을 순회하며 이전 단계의 값(누적값, accumulator)을 다음 단계로 넘기면서,
최종적으로 단 하나의 값을 만들어내는 메서드다.

그 결과물은 숫자일 수도 있고, 문자열일 수도 있고, 객체일 수도 있고, 배열일 수도 있다.
원본을 유지하면서 “배열을 원하는 형태로 만들기 위한 로직을 직접 만드는 도구”라고 보면 된다.

---

# 기본 문법

```js
array.reduce((accumulator, current, index, array) => {
  return 다음_acc;
}, 초기값);
```

accumulator (acc): 누적되는 값
current: 현재 요소
index: 현재 인덱스
array: 원본 배열
초기값: acc의 최초 값
반환값: 누적이 끝난 최종 acc
원본 변경: ❌

---

# 기본 예시 - 총합 구하기

```js
const numbers = [10, 20, 30];

const sum = numbers.reduce((acc, n) => acc + n, 0);

console.log(sum); // 60
```

💡 acc는 계속 누적되고, 최종 결과는 단일 숫자가 된다.

---

# 초기값이 중요한 이유

```js
const arr = [1, 2, 3];

arr.reduce((acc, cur) => acc + cur);
// 초기값 미지정 시 acc = 첫 요소 = 1
```

💡 초기값을 주는 게 더 안전하고 실무에서도 권장된다.

---

# 객체 데이터 집계 예시 - 총 나이

```js
const users = [
  { name: '레온', age: 25 },
  { name: '지민', age: 30 },
];

const totalAge = users.reduce((acc, u) => acc + u.age, 0);

console.log(totalAge); // 55
```

💡 API 응답에서 전체 수치 계산할 때 많이 사용.

---

# 실무 예시 1 - 배열 → 객체 변환

```js
const fruits = ['apple', 'banana', 'apple'];

const counter = fruits.reduce((acc, f) => {
  acc[f] = (acc[f] || 0) + 1;
  return acc;
}, {});

console.log(counter); // { apple: 2, banana: 1 }
```

💡 데이터 통계(빈도 분석)에서 reduce가 가장 강력함.

---

# 실무 예시 2 - 그룹화(groupBy)

```js
const users = [
  { name: '레온', team: 'A' },
  { name: '지민', team: 'B' },
  { name: '유라', team: 'A' },
];

const group = users.reduce((acc, u) => {
  acc[u.team] = acc[u.team] || [];
  acc[u.team].push(u);
  return acc;
}, {});

console.log(group);
// {
//   A: [{name: "레온", team: "A"}, {name: "유라", team: "A"}],
//   B: [{name: "지민", team: "B"}]
// }
```

💡 백엔드에서 “팀별 목록” 정렬할 때 정말 유용한 패턴.

---

# 실무 예시 3 - 깊은 변환 (중첩 배열 펼치기)

```js
const nested = [
  [1, 2],
  [3, 4],
];

const flat = nested.reduce((acc, arr) => acc.concat(arr), []);

console.log(flat); // [1, 2, 3, 4]
```

💡 flatMap이 없던 시절엔 reduce로 구현했다.

---

# 실무 예시 4 - 누적 문자열 만들기

```js
const words = ['레온', '은', '개발자다'];

const sentence = words.reduce((acc, w) => acc + ' ' + w);

console.log(sentence); // "레온 은 개발자다"
```

💡 단순 텍스트 조합도 가능.

---

# 실무 예시 5 - React: 복잡한 상태 계산

```jsx
const prices = [1000, 2500, 5000];

const total = prices.reduce((acc, p) => acc + p, 0);

return <div>총액: {total}</div>;
```

💡 계산 로직이 컴포넌트 안에서 자연스럽게 이루어진다.

---

# 추가 정보

- reduce는 “배열 → 어떤 형태든” 만들 수 있는 만능 변환기다.
- 하지만 지나치게 복잡한 reduce는 가독성을 해치므로 팀에서는 map/some/filter로 가능한지 먼저 고려한다.
- 초기값은 꼭 설정하는 것이 안전하다(특히 비어 있는 배열 처리).
- acc는 자유롭게 원하는 자료형으로 설정할 수 있다(숫자, 객체, 배열 등).
- reduce는 “집계”, “통계”, “그룹화”, “변환” 같은 고급 로직에 매우 강력하다.
