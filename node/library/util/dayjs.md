# Day.js — 경량 날짜·시간 라이브러리

_참고 사이트_
https://day.js.org/

---

# 1. 개요

Day.js는 Moment.js와 동일한 API를 제공하면서도,
파일 크기가 매우 작은 경량(date/time) 라이브러리다.
직관적인 체이닝 문법으로 날짜 포맷, 계산, 비교 등을 쉽게 할 수 있다.

npm i dayjs ✅ 설치 필요

---

# 2. 주요 역할

Express · Next.js · Node.js 환경 전부에서 잘 동작한다.

- Moment.js와 거의 동일한 사용법
- 가볍고 빠름
- 체이닝 방식 API
- UTC, timezone, duration 등 플러그인 확장 가능
- 프론트/백 모두에서 사용 가능

---

# 3. 기본 사용법

**< 현재시간 >**

```js
import dayjs from 'dayjs';

console.log(dayjs().format());
// 2025-11-19T13:34:12+09:00
```

---

# 4. 날짜 포맷(format)

```js
dayjs().format('YYYY-MM-DD');
dayjs().format('YYYY/MM/DD HH:mm');
```

---

# 5. 날짜 계산(add, subtract)

```js
dayjs().add(3, 'day'); // +3일
dayjs().subtract(1, 'month'); // -1개월
dayjs().add(2, 'hour');
```

---

# 6. 날짜 비교(isBefore, isAfter, isSame)

```js
dayjs('2025-01-01').isBefore('2025-02-01');
dayjs('2025-05-01').isAfter('2025-04-01');
dayjs('2025-03-01').isSame('2025-03-01', 'day');
```

---

# 7. 날짜 간 차이(diff)

```js
dayjs('2025-12-31').diff('2025-01-01', 'day'); // 일수 차이
dayjs('2025-12-31').diff('2025-01-01', 'month'); // 월 차이
```

---

# 8. 날짜 파싱 및 생성

```js
dayjs('2025-04-05');
dayjs('2025-04-05T15:00:00');
```

---

# 9. 플러그인 사용 (확장 기능)

Day.js는 기본 기능이 가볍기 때문에 많은 기능이 플러그인 형태로 제공된다.

**< UTC 플러그인 >**

```js
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

dayjs().utc().format();
```

**< Timezone 플러그인 >**

```js
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(timezone);

dayjs().tz('Asia/Seoul').format();
```

---

# 10. 실무 예시

**< DB datetime → 날짜 문자열 변환 >**

```js
const formatted = dayjs(user.createdAt).format('YYYY-MM-DD HH:mm');
```

**< 만료시간(Token, OTP) 계산 >**

```js
const expires = dayjs().add(15, 'minute').toDate();
```

**< 시간 차이로 특정 로직 실행 >**

```js
if (dayjs().diff(user.lastLoginAt, 'day') > 30) {
  console.log('30일 이상 미접속 유저');
}
```
