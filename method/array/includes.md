# 배열+문자열 메서드 - includes

_구분_
🧭 포함 여부 판단

_실무 비율_
⭐⭐⭐⭐⭐

_설명_
배열 또는 문자열이 특정 값을 포함하고 있는지(boolean)를 검사하는 메서드다.
찾으면 true, 없으면 false를 반환한다.
일치 여부는 완전 일치(strict equality, ===) 기준이다.

---

# 기본 문법

**< 배열 >**

```js
array.includes(valueToFind, fromIndex?);
```

valueToFind: 찾을 값
fromIndex: 검색 시작 위치(기본은 0)
반환값: boolean

**< 문자열 >**

```js
array.includes(valueToFind, fromIndex?);
```

searchString: 찾을 문자열
position: 시작 위치
반환값:

원본 변경: ❌ (읽기 전용 검사)

---

# 기본 예시 (배열/문자열)

**< 배열 >**

```js
const numbers = [1, 2, 3, 4];

console.log(numbers.includes(3)); // true
console.log(numbers.includes(5)); // false
```

💡 배열 안에 해당 값이 존재하는지만 빠르게 판단.

**< 문자열 >**

```js
const message = 'Hello Leon';

console.log(message.includes('Leon')); // true
console.log(message.includes('leo')); // false (대소문자 구분)
```

💡 문자열에서도 동일하게 구동된다.

---

# 실무 예시 1 - 권한 체크

```js
const roles = ['USER', 'MANAGER', 'ADMIN'];
const requiredRole = 'ADMIN';

const allowed = roles.includes(requiredRole);

console.log(allowed); // true
```

💡 RBAC, JWT 권한 시스템에서 너무 흔하다.

---

# 실무 예시 2 - 검색(키워드 포함 여부)

```js
const keyword = 'apple';
const title = 'fresh apple juice';

const isMatch = title.includes(keyword);

console.log(isMatch); // true
```

💡 간단한 검색 기능이면 includes 하나로 충분.

---

# 실무 예시 3 - 금지어 필터링

```js
const banned = ['욕설1', '19금', '불건전'];

const text = '이 문장은 19금을 포함하고 있습니다';

const flagged = banned.some((word) => text.includes(word));

console.log(flagged); // true
```

💡 includes는 some과 조합하면 훨씬 강력하다.

---

# 실무 예시 4 - 파일 확장자 검사

```js
const allowedExt = ['jpg', 'jpeg', 'png'];
const fileName = 'profile.jpeg';

const isValid = allowedExt.includes(fileName.split('.').pop());

console.log(isValid); // true
```

💡 백엔드 이미지 업로드 검증에서 거의 필수.

---

# 실무 예시 5 - React 조건부 UI

```jsx
const currentTab = 'home';
const hiddenTabs = ['settings', 'admin'];

const isHidden = hiddenTabs.includes(currentTab);

return <>{!isHidden && <TabContent />}</>;
```

💡 특정 탭을 숨기는 로직 같은 거에 좋다.

---

# 추가 정보

- includes는 === 비교를 사용하므로 객체/배열의 “내용” 비교는 불가능하다.
- 문자열 includes는 대소문자를 구분한다 → 필요하면 .toLowerCase()와 함께 사용.
- filter나 some에 끼워 넣으면 가볍고 강력한 검사 로직이 된다.
- indexOf보다 읽기 쉽고 명확해서 현대 JS에서는 includes가 사실상 표준.
- 실무에서 “유효 값인지 확인”할 때 includes는 가장 빠르게 떠올릴 수 있는 도구다.
