# 문자열 메서드 - trim

_구분_
🧽 문자열 양 끝 공백 제거

_실무 비율_
⭐⭐⭐⭐⭐

_설명_
문자열의 **양쪽 끝에 있는 공백(스페이스, 탭, 줄바꿈 등)**을 제거한 새 문자열을 반환한다.
중간 공백은 제거하지 않는다.
원본 문자열은 불변이다.

---

# 기본 문법

```js
string.trim();
```

반환값: 앞뒤 공백이 제거된 새 문자열
원본 변경: ❌

---

# 기본 예시

```js
const name = '   레온   ';

console.log(name.trim()); // "레온"
```

💡 앞뒤의 공백만 제거!

---

# 중간 공백은 제거하지 않음

```js
console.log('레 온'.trim()); // "레 온"
```

💡 필요하면 replace나 정규식을 써야 한다.

---

# trimStart / trimEnd

```js
'   hello   '.trimStart(); // "hello   "
'   hello   '.trimEnd(); // "   hello"
```

💡 앞 또는 뒤만 깔끔하게 지우고 싶을 때 사용.

---

# 실무 예시 1 - 로그인/회원가입 검증

```js
const email = inputEmail.trim();

if (!email) {
  throw new Error('이메일을 입력하세요');
}
```

💡 사용자가 입력한 문자열엔 항상 공백이 끼어 있기 때문에 필수.

---

# 실무 예시 2 - 검색창 입력 정리

```js
const keyword = searchInput.trim();

const results = items.filter((item) => item.title.includes(keyword));
```

💡 앞뒤 공백 때문에 검색이 안 되는 사고를 방지.

---

# 실무 예시 3 - 백엔드 API 요청 파싱

```js
const title = req.body.title.trim();

if (!title) {
  return res.status(400).json({ message: '제목이 비어 있음' });
}
```

💡 API 검증에서 trim은 사실상 기본 룰.

---

# 실무 예시 4 - CSV 데이터 클린업

```js
const values = line.split(',').map((v) => v.trim());
```

💡 split과 함께 쓰면 데이터 정제가 깔끔해진다.

---

# 실무 예시 5 - React 폼 입력 처리

```jsx
const handleSubmit = () => {
  const cleanName = name.trim();
  // cleanName을 서버로 전송
};
```

💡 입력값 저장 전에 항상 trim하여 불필요한 오류를 줄인다.

---

# trim과 정규식 비교

trim은 양 끝 공백만 제거. 중간 공백을 제거하려면,

```js
const noSpaces = str.replace(/\s+/g, '');
```

---

# 추가 정보

- 모든 공백을 지우는 게 아니라 양쪽 끝만 제거한다는 걸 항상 기억.
- 사용자 입력은 대부분 실수로 공백을 넣기 때문에, trim은 입력 검증의 사실상 기본.
- split, replace, toLowerCase 등 문자열 전처리 메서드와 조합해서 강력한 데이터 정제가 가능하다.
- trimStart/trimEnd도 상황에 맞게 활용하면 편하다.
- 문자열에는 불변성이 있기 때문에 trim은 항상 새로운 문자열을 반환한다.
