# 배열 메서드 - slice

_구분_
✂️ 부분 복사 / 비파괴적 추출

_실무 비율_
⭐⭐⭐⭐

_설명_
배열의 특정 구간을 잘라서 새 배열을 만든다.
시작 인덱스부터 끝 인덱스 직전까지 복사한다.
원본 배열은 전혀 변경되지 않는다.

---

# 기본 문법

```js
array.slice(begin, end);
```

begin: 시작 인덱스
end: 끝 인덱스(포함 ❌ — 직전까지)
반환값: 새 배열
원본 변경: ❌ (불변)

---

# 기본 예시

```js
const arr = [1, 2, 3, 4, 5];

const part = arr.slice(1, 4);

console.log(part); // [2, 3, 4]
console.log(arr); // [1, 2, 3, 4, 5]
```

💡 end는 포함되지 않는다는 점이 가장 중요하다.

---

# end 생략 (끝까지)

```js
const arr = [1, 2, 3, 4, 5];
const part = arr.slice(2);

console.log(part); // [3, 4, 5]
```

💡 begin만 적으면 그 지점부터 끝까지 복사.

---

# 음수 인덱스 예시

```js
const arr = [1, 2, 3, 4];

console.log(arr.slice(-2)); // [3, 4]
console.log(arr.slice(-3, -1)); // [2, 3]
```

💡 음수는 뒤에서부터 계산된다.

---

# 배열 복사 (가장 흔한 패턴)

```js
const arr = [1, 2, 3];
const copy = arr.slice();

console.log(copy); // [1, 2, 3]
```

💡 원본을 복사하는 가장 대표적이고 안전한 방법.

---

# 객체 배열 부분 복사

```js
const users = [
  { id: 1, name: '레온' },
  { id: 2, name: '지민' },
  { id: 3, name: '유라' },
];

const firstTwo = users.slice(0, 2);

console.log(firstTwo); // [{ id:1 }, { id:2 }]
```

💡 목록 페이징, 무한 스크롤 페이지에서 종종 사용된다.

---

# 실무 예시 1 - 게시판 목록 페이징

```js
const list = [...Array(100).keys()]; // 0~99
const page = 1;
const take = 10;

const start = page * take;
const end = start + take;

const result = list.slice(start, end);

console.log(result); // 10~19
```

💡 단순 페이징 로직이면 slice가 가장 간단하다.

---

# 실무 예시 2 - 파일명 확장자 추출

```js
const file = 'profile.jpeg';

const ext = file.slice(file.lastIndexOf('.') + 1);

console.log(ext); // "jpeg"
```

💡 문자열도 slice 사용 가능 → 백엔드에서 이미지 검증할 때 흔함.

---

# 실무 예시 3 - React 상태 업데이트(불변성 유지)

```jsx
const newList = [...list.slice(0, index), newValue, ...list.slice(index + 1)];
```

💡 배열 항목 교체 시 slice로 비파괴적 업데이트를 만든다.

---

# 실무 예시 4 - 최근 N개만 가져오기

```js
const logs = ['a', 'b', 'c', 'd', 'e'];

const last3 = logs.slice(-3);

console.log(last3); // ['c', 'd', 'e']
```

💡 최근 활동 내역, 최근 주문 기록 등에서 매우 사용됨.

---

# 비교: slice vs splice

slice → ❌ 원본 유지 (새 배열 반환)
splice → ⛔ 원본 변경 (잘라내거나 삽입)

💡 형이 다른 느낌이라 실수하면 큰 사고 나기 쉽다.

---

# 추가 정보

- slice는 절대 원본을 건드리지 않는다 → 불변성이 중요한 상황에서 강력.
- 문자열에도 동일하게 적용 가능 ("Hello".slice(1, 3) → "el").
- 음수 인덱스는 “뒤에서부터”라는 의미라 마지막 요소 접근이 쉬움.
- 배열 전체 복사에도 많이 쓰이지만, 최신 JS에서는 [...array]도 대체 가능.
- splice와 헷갈리면 큰일 난다 → slice는 비파괴, splice는 파괴.
