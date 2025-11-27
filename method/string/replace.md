# 문자열 메서드 - replace

_구분_
🪄 문자열 치환(단일 매칭)

_실무 비율_
⭐⭐⭐⭐⭐

_설명_
문자열에서 처음 매칭되는 부분 하나만 찾아 다른 값으로 교체한 새 문자열을 반환한다.
원본 문자열은 변경되지 않는다.
여기서 중요한 점은,
기본 replace는 첫 번째 매칭만 바꾼다.
여러 개를 모두 바꾸고 싶으면 replaceAll 또는 정규식의 /g 플래그를 사용해야 한다.

---

# 기본 문법

```js
string.replace(searchValue, replaceValue);
```

searchValue: 문자열 또는 정규식
replaceValue: 치환할 문자열
반환값: 치환된 새 문자열
원본 변경: ❌ (불변)

---

# 기본 예시

```js
const text = 'apple banana apple';

console.log(text.replace('apple', '레온')); // "레온 banana apple"
```

💡 첫 번째 apple만 교체된다.

---

# 정규식 사용 (g 플래그 → 전체 치환)

```js
const text = 'apple banana apple';

console.log(text.replace(/apple/g, '레온')); // "레온 banana 레온"
```

💡 /g를 사용하면 모든 apple을 교체.

---

# replaceAll (ES2021)

```js
const text = 'a-b-c-d';

console.log(text.replaceAll('-', '_')); // "a_b_c_d"
```

💡 반복 치환이 필요하면 replaceAll이 가장 직관적.

---

# 함수 기반 치환 (고급)

replaceValue에 함수를 넣으면 매칭된 값이 들어오고, 반환값으로 바꿀 내용을 만들 수 있다.

```js
const text = 'price: 100';

const result = text.replace(/(\d+)/, (match) => Number(match) * 2);

console.log(result); // "price: 200"
```

💡 숫자를 계산해서 치환하는 등, 로직이 필요한 경우 강력함.

---

# 실무 예시 1 - 개인 정보 마스킹

```js
const phone = '010-1234-5678';

const masked = phone.replace(/\d{4}$/, '****');

console.log(masked); // "010-1234-****"
```

💡 사용자 개인정보 가릴 때 매우 자주 씀.

---

# 실무 예시 2 - 파일 확장자 변경

```js
const file = 'example.jpg';

console.log(file.replace(/\.jpg$/, '.png')); // "example.png"
```

💡 백엔드 이미지 처리에서 흔한 패턴.

---

# 실무 예시 3 - URL 파라미터 서식 변경

```js
const url = '/users/:id/posts/:postId';

const concrete = url.replace(':id', 10).replace(':postId', 99);

console.log(concrete); // "/users/10/posts/99"
```

💡 라우팅 템플릿 → 실제 값 삽입.

---

# 실무 예시 4 - HTML 태그 제거 (간단 버전)

```js
const html = '<p>레온</p>';

console.log(html.replace(/<[^>]+>/g, '')); // "레온"
```

💡 서버에서 간단한 HTML 정리할 때.

---

# 실무 예시 5 - React 인풋 자동 포맷팅

```jsx
const formatted = inputValue.replace(/\D/g, ''); // 숫자만 남기기
```

💡 입력값 정규화에서 매우 많이 쓰인다.

---

# replace vs replaceAll

```js
'aaa'.replace('a', 'b'); // "baa"
'aaa'.replaceAll('a', 'b'); // "bbb"
```

replace → 첫 번째만
replaceAll → 전체

💡 정규식 /g로도 동일하게 가능하지만, replaceAll이 더 가독성 좋다.

---

# 추가 정보

- 문자열은 불변이므로 replace는 항상 새 문자열을 만든다.
- 다중 치환이 필요하면 replaceAll 또는 정규식 /g를 활용.
- 정규식과 함께 사용하면 매우 강력해져서 데이터 정제·파싱에 적합하다.
- 문자열 기반 템플릿 처리, 민감 정보 마스킹, 입력값 정규화 등 실무 출현 빈도가 매우 높다.
- 복잡한 치환 로직이 필요한 경우 replaceValue에 함수를 쓰는 패턴을 적극 활용.
