# 배열 메서드 - toReversed

_구분_
🔄 비파괴적(reverse) 뒤집기

_실무 비율_
⭐⭐⭐

_설명_
배열의 순서를 거꾸로 뒤집은 새로운 배열을 반환한다.
기존 reverse()와 달리 원본 배열을 절대 변경하지 않는다.

```js
arr.toReversed() === [...arr].reverse();
```

---

# 기본 문법

```js
array.toReversed();
```

반환값: 뒤집힌 새 배열
원본 변경: ❌ (안전!)

---

# 기본 예시

```js
const arr = [1, 2, 3];

const reversed = arr.toReversed();

console.log(reversed); // [3, 2, 1]
console.log(arr); // [1, 2, 3] (원본 유지)
```

---

# 기존 reverse()와 비교

```js
const arr = [1, 2, 3];

const r1 = arr.reverse();
// arr === [3, 2, 1]  (원본 변경)

const r2 = arr.toReversed();
// arr 그대로 / r2는 새로운 배열
```

💡 협업 환경에서는 reverse() 사용 금지인 팀도 많다.

---

# 실무 예시 1 - React 렌더링에서 안전하게 역순 처리

```jsx
const reversed = comments.toReversed();

return (
  <ul>
    {reversed.map((c) => (
      <li key={c.id}>{c.text}</li>
    ))}
  </ul>
);
```

💡 reverse()는 원본을 뒤틀어서 상태가 꼬인다 → toReversed가 정답.

---

# 실무 예시 2 - Prisma/DB 응답 역순 정렬

```js
const posts = await prisma.post.findMany();

const recentFirst = posts
  .toSorted((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .toReversed(); // 필요하다면 더 뒤집기
```

💡 sort + reverse 조합을 비파괴적으로 처리할 수 있다.

---

# 실무 예시 3 - 최근 로그 역순 출력

```js
const logs = ['A', 'B', 'C', 'D'];

const newestFirst = logs.toReversed();

console.log(newestFirst); // ["D", "C", "B", "A"]
```

---

# 실무 예시 4 - Paging/Infinite Scroll에서 역순 변환

```js
const pageData = await fetchData();
const reversedPage = pageData.toReversed();
```

💡 데이터를 그대로 두고 표시 순서만 바꿔야 할 때 안전함.

---

# 실무 예시 5 - 불변성 유지 로직

```js
function getReversed(list) {
  return list.toReversed();
}
```

💡 원본을 지켜야 하는 함수형 코드에서 유용.

---

# 추가 정보

- reverse()를 신뢰하지 말자 → 원본을 바꾸는 순간 버그 가능성이 폭발함.
- toReversed는 React·Vue·Svelte 등의 상태 관리에서 아주 큰 도움이 된다.
- Node 20+, 최신 브라우저에서 지원되므로 실무에서도 안정적으로 사용할 수 있다.
- 정렬 후 뒤집기 등, 복잡한 순서 제어에서 안전하고 깔끔한 패턴을 만든다.
- spread + reverse 패턴보다 가독성이 훨씬 높고 의도를 명확히 드러낸다.
