# 배열 메서드 - flatMap

_구분_
🌀 변환 + 평탄화(1단계)

_실무 비율_
⭐⭐⭐

_설명_
각 요소를 **변환(map)**한 뒤, 그 결과를 **1단계만 평탄화(flat)**한다.
즉, map과 flat(1단계)을 합친 기능이다.

---

# 기본 문법

```js
array.flatMap((element, index, array) => {
  return 변환된_값; // 보통 단일 값 또는 배열
});
```

반환값: 변환 + 1단계 평탄화된 새 배열
원본 변경: ❌ (불변)

---

# 기본 예시 - map + flat 대체

```js
const arr = [1, 2, 3];

const result = arr.flatMap((n) => [n, n * 2]);

console.log(result); // [1, 2, 2, 4, 3, 6]
```

💡 map으로 하면 [[1,2],[2,4],[3,6]]가 나오는데 flatMap은 자동으로 펼쳐준다.

---

# 빈 배열 반환 → 필터링처럼 작동

```js
const arr = [1, 2, 3, 4];

const even = arr.flatMap((n) => (n % 2 === 0 ? [n] : []));

console.log(even); // [2, 4]
```

💡 filter + map 효과를 동시에 구현할 수 있다.

---

# 문자열 분리 예시 (자주 사용)

```js
const words = ['Hello world', '레온 사랑한다'];

const result = words.flatMap((w) => w.split(' '));

console.log(result); // ["Hello", "world", "레온", "사랑한다"]
```

💡 배열 안에 문장이 여러 개 있을 때 단어 리스트 추출에 아주 유용하다.

---

# 객체 배열 변환 - 중첩 배열 해제

```js
const users = [
  { name: '레온', tags: ['dev', 'backend'] },
  { name: '지민', tags: ['frontend'] },
];

const tags = users.flatMap((u) => u.tags);

console.log(tags); // ["dev", "backend", "frontend"]
```

💡 API 응답에서 tag, hobby, category 등 배열 안 배열을 펼칠 때 자주 사용.

---

# 실무 예시 1 - 중첩된 댓글 목록 펼치기

```js
const comments = [
  { id: 1, replies: [{ id: 11 }, { id: 12 }] },
  { id: 2, replies: [{ id: 21 }] },
];

const allReplies = comments.flatMap((c) => c.replies);

console.log(allReplies); // [{id:11},{id:12},{id:21}]
```

💡 DB에서 JOIN한 구조를 평탄화할 때 자주 등장한다.

---

# 실무 예시 2 - 라우팅 리스트 변환 (Next/React)

```js
const routes = [
  { menu: '홈', paths: ['/', '/home'] },
  { menu: '회원', paths: ['/login', '/signup'] },
];

const allPaths = routes.flatMap((r) => r.paths);

console.log(allPaths); // ["/", "/home", "/login", "/signup"]
```

💡 메뉴 → 라우트 목록으로 변환하는 과정에서 깔끔해진다.

---

# 실무 예시 3 - 데이터 분해 및 재조립

```js
const logs = ['a,b,c', 'd,e'];

const events = logs.flatMap((line) => line.split(','));

console.log(events); // ["a", "b", "c", "d", "e"]
```

💡 CSV-like 문자열을 펼쳐서 개별 요소로 만드는 데 사용.

---

# 실무 예시 4 - Prisma / DB 응답 변환

```js
const users = await prisma.user.findMany({
  include: { posts: true },
});

// posts만 평탄 배열로 만들기
const allPosts = users.flatMap((u) => u.posts);
```

💡 백엔드에서 JOIN 데이터를 단일 리스트로 펼칠 때 자연스럽다.

---

# 실무 예시 5 - React 요소 렌더링

```jsx
const menus = [
  { name: '레온', items: ['A', 'B'] },
  { name: '지민', items: ['C'] },
];

return (
  <ul>
    {menus.flatMap((m) =>
      m.items.map((item, i) => <li key={m.name + i}>{item}</li>)
    )}
  </ul>
);
```

💡 2중 map을 flatMap으로 합치면 더 읽기 쉬운 경우가 꽤 많다.

---

# 추가 정보

- flatMap은 “map 결과가 배열일 때” 진짜 진가가 드러난다.
- 깊이(flat level)는 1만 지원한다 → 더 깊은 평탄화가 필요하면 flat() 사용.
- map → flat 조합보다 성능도 약간 더 좋다.
- filter처럼 쓰고 싶으면 “조건 만족 시 배열, 아니면 빈 배열”을 반환하는 패턴이 정석.
- DB 응답, React 렌더링, 문자열 분해 등에서 코드가 깔끔하게 정리된다.
