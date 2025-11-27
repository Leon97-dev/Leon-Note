# Math 객체 정리

_참고 사이트_
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math?utm_source=chatgpt.com

---

1. 절댓값 (Absolute Value)

어떤 값의 '양수(positive number)' 버전.
Math.abs(x)를 하면 x의 절댓값이 리턴된다.

```js
console.log(Math.abs(-10)); // 10
console.log(Math.abs(10)); // 10
```

---

2. 최댓값 (Maximum)

Math.max 함수에 파라미터로 여러 수를 넘겨주면, 그중 가장 큰 값이 리턴된다.

```js
console.log(Math.max(2, -1, 4, 5, 0)); // 5
```

---

3. 최솟값 (Minimum)

Math.min 함수에 파라미터로 여러 수를 넘겨주면, 그중 가장 작은 값이 리턴된다.

```js
console.log(Math.min(2, -1, 4, 5, 0)); // -1
```

---

4. 거듭제곱 (Exponentiation)

자바스크립트에서 Math.pow(x, y)를 하면 x의 y승의 결괏값이 리턴된다.

```js
console.log(Math.pow(2, 3)); // 8
console.log(Math.pow(5, 2)); // 25
```

---

5. 제곱근 (Square Root)

Math.sqrt(x)를 하면 x의 제곱근이 리턴된다.

```js
console.log(Math.sqrt(25)); // 5
console.log(Math.sqrt(49)); // 7
```

---

6. 반올림 (Round)

Math.round(x)를 하면 x의 반올림된 값이 리턴된다.

```js
console.log(Math.round(2.49)); // 2
console.log(Math.round(2.5)); // 3
```

---

7. 버림과 올림 (Floor and Ceil)

Math.floor(x)을 하면 x의 버림 값이, Math.ceil(x)을 하면 x의 올림 값이 리턴된다.
이 경우, 소수 부분이 얼마인지와는 상관이 없다.

```js
console.log(Math.floor(2.8)); // 2
sole.log(Math.ceil(2.4)); // 3
```

---

8. 난수 (Random)

Math.random을 하면 0 이상 1 미만의 값이 랜덤으로 리턴된다.

```js
console.log(Math.random()); // 0.214583690597
console.log(Math.random()); // 0.662204080321
```
