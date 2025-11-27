# 문자열 메서드 - split

_구분_
🔡 문자열 분해 / 구분자 기반 분리

_실무 비율_
⭐⭐⭐⭐⭐

_설명_
문자열을 특정 구분자(separator) 기준으로 잘라서 배열로 반환한다.
구분자가 여러 글자여도 가능하고, 정규식(RegExp)도 사용할 수 있다.
원본 문자열은 절대 변경되지 않는다.

---

# 기본 문법

```js
string.split(separator, limit?);
```

separator: 문자열을 나눌 기준(문자, 문자열, 정규식)
limit: 분리할 최대 개수 (선택)
반환값: 잘려 나온 조각들로 구성된 배열
원본 변경: ❌

---

# 기본 예시

```js
const text = 'apple,banana,cherry';

const parts = text.split(',');

console.log(parts); // ["apple", "banana", "cherry"]
```

---

# 공백 기준 분리

```js
const sentence = '레온 은 개발자다';

console.log(sentence.split(' ')); // ["레온", "은", "개발자다"]
```

💡 가장 흔한 패턴 중 하나.

---

# 글자 단위 분리

```js
console.log('LEON'.split('')); // ["L", "E", "O", "N"]
```

---

# 제한(limit) 사용

```js
const str = 'a-b-c-d';

console.log(str.split('-', 2)); // ["a", "b"]
```

💡 여러 개 중 앞 부분만 필요할 때 쓰인다.

---

# 구분자가 없을 때

```js
console.log('Hello'.split()); // ["Hello"]
```

💡 split()을 그냥 호출하면 배열 하나로 반환된다.

---

# 실무 예시 1 - 파일 확장자 추출

```js
const file = 'profile.jpeg';

const ext = file.split('.').pop();

console.log(ext); // "jpeg"
```

💡 이미지 업로드, 유저 프로필 처리 등에 매우 빈번.

---

# 실무 예시 2 - CSV 파싱

```js
const csv = '레온,25,개발자';

const [name, age, job] = csv.split(',');

console.log(name, age, job); // "레온" "25" "개발자"
```

💡 CSV 데이터 분해는 split의 대표적 활용.

---

# 실무 예시 3 - URL 파싱

```js
const url = '/users/123/posts/77';

const parts = url.split('/');
// ["", "users", "123", "posts", "77"]

const userId = parts[2];
```

💡 REST API 라우팅 데이터 처리에서 흔한 패턴.

---

# 실무 예시 4 - 로그 분석

```js
const log = 'ERROR|2025-01-01|DB_CONNECTION_FAIL';

const [level, date, message] = log.split('|');

console.log(level); // "ERROR"
console.log(message); // "DB_CONNECTION_FAIL"
```

💡 백엔드에서 로그를 처리할 때 split 자주 등장.

---

# 실무 예시 5 - React 입력값 처리

```jsx
const tags = inputValue.split(',').map((t) => t.trim());
```

💡 “태그 입력” 기능 만들 때 인풋 문자를 배열로 바꾸는 패턴.

---

# 정규식(RegExp) 분리

```js
const text = 'a1b2c3d';

console.log(text.split(/[0-9]/));
// ["a", "b", "c", "d"]
```

💡 복잡한 분해가 필요할 때 정규식을 함께 사용 가능.

---

# split vs join (짝꿍)

split = 문자열 → 배열
join = 배열 → 문자열

💡 둘은 서로 반대 개념이라 함께 배우면 훨씬 이해하기 쉽다.

---

# 추가 정보

- 구분자 자체는 제거되고, 그 사이의 조각들이 배열로 반환된다.
- 문자열 처리에서 “가장 강력한 기본기”이므로 무조건 익숙해져야 한다.
- trim과 조합하면 더 깔끔하게 데이터 정리 가능(.split(',').map(t => t.trim())).
- API, 로그, CSV, URL, HTML 파싱… 정말 모든 분야에서 쓰인다.
- 구분자가 연속될 때는 빈 문자열 요소가 생길 수 있어서 주의 필요.
