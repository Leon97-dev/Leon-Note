# 문자열 메서드 - startsWith

_구분_
🔍 접두사(prefix) 검사

_실무 비율_
⭐⭐⭐⭐

_설명_
문자열이 특정 문자열로 시작하면 true, 아니면 false를 반환한다.
두 번째 인자로 **검사를 시작할 위치(position)**를 지정할 수도 있다.
원본 문자열은 변하지 않는다.

---

# 기본 문법

```js
string.startsWith(searchString, position?);
```

searchString: 시작 부분에서 찾을 문자열
position: 검사 시작 위치(기본값 0)
반환값: boolean
원본 변경: ❌

---

# 기본 예시

```js
console.log('LeonDev'.startsWith('Leon')); // true

console.log('LeonDev'.startsWith('Dev')); // false
```

---

# position 사용 예시

```js
const text = '2025-11-21';

console.log(text.startsWith('11', 5));
// true (5번째 인덱스부터 확인 → "11-21")
```

---

# 대소문자 구분됨

```js
'Leon'.startsWith('le'); // false

// 필요하면 toLowerCase()와 조합
'Leon'.toLowerCase().startsWith('le'); // true
```

---

# 실무 예시 1 - URL 라우팅 검사

```js
const url = '/api/users/123';

if (url.startsWith('/api/')) {
  console.log('API 요청입니다.');
}
```

💡 백엔드·프론트 라우팅 모두에서 자주 등장.

---

# 실무 예시 2 - 파일 확장자(접두사) 검사

```js
const filename = 'img_profile.png';

console.log(filename.startsWith('img_')); // true
```

💡 접두사가 규칙인 파일명 구조에서 자주 사용.

---

# 실무 예시 3 - 검색 자동완성 Prefix Matching

```js
const keyword = '레';
const names = ['레온', '레나', '지민'];

const result = names.filter((n) => n.startsWith(keyword));

console.log(result); // ["레온", "레나"]
```

💡 검색어 기반 추천 기능에서 많이 씀.

---

# 실무 예시 4 - 토큰/키 검증

```js
const token = 'Bearer abc123';

if (token.startsWith('Bearer ')) {
  console.log('정상적인 토큰');
}
```

💡 Authorization 헤더 같은 곳에서 자주 쓰는 패턴.

---

# 실무 예시 5 - 로그 레벨 판별

```js
const log = '[ERROR] Something went wrong';

if (log.startsWith('[ERROR]')) {
  alert('에러 로그입니다!');
}
```

💡 로그 앞부분을 패턴으로 삼는 경우가 많다.

---

# startsWith vs endsWith

str.startsWith("prefix") // 시작 검사
str.endsWith("suffix") // 끝 검사

💡 둘은 함께 쓰일 때 더 강력해진다.

---

# 추가 정보

- startsWith는 문자열 검사에서 가장 읽기 좋은 방식이다(가독성 최고).
- 대소문자를 구분하므로 입력값 검증 시 toLowerCase()와 자주 조합.
- position 인자는 의외로 실무에서 자주 쓰인다(날짜, 코드 패턴 등).
- includes와 차이: includes는 어디든 포함 여부, startsWith는 “맨 앞"만.
- 문자열 라우팅·검색·검증 등에서 if문의 표현을 크게 단순화할 수 있다.
