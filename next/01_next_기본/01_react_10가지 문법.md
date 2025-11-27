# Next.js 배우기 전 알아야 할 React 10개 문법

React는 UI를 구성하는 기술,
Next.js는 그 위에 서버·라우팅을 얹은 프레임워크다.
아래 10가지만 알면 Next.js의 대부분 코드가 이해 가능하다.

# 1. 컴포넌트 (Component)

React의 기본 단위.
하나의 화면 조각(버튼, 카드, 페이지 등)을 함수로 만든다.

```jsx
function Hello() {
  return <h1>안녕, 레온!</h1>;
}

export default Hello;
```

Next.js의 모든 페이지(page.js)도 결국 이런 함수형 컴포넌트다.

# 2. JSX (JavaScript + XML)

HTML처럼 보이지만 실제로는 JavaScript 코드다.
중괄호 {} 안에는 변수나 표현식을 쓸 수 있다.

```jsx
const name = '레온';
return <h1>{name}의 첫 번째 컴포넌트</h1>;
```

JSX는 브라우저가 직접 이해하지 못하므로, Next.js가 자동으로 컴파일해준다.

# 3. Props (컴포넌트 간 데이터 전달)

부모 컴포넌트가 자식에게 값을 전달할 때 사용한다.

```jsx
function Welcome(props) {
  return <h2>안녕, {props.name}!</h2>;
}

export default function App() {
  return <Welcome name="레온" />;
}
```

Next.js에서도 컴포넌트 간 재사용 시 props 패턴이 그대로 쓰인다.

# 4. State (상태 관리)

컴포넌트 내부에서 데이터가 변할 때 화면을 다시 렌더링하기 위한 값.

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>현재 값: {count}</p>
      <button onClick={() => setCount(count + 1)}>증가</button>
    </div>
  );
}
```

Next.js의 클라이언트 컴포넌트에서도 useState 자주 사용된다.

# 5. 이벤트 핸들링

버튼 클릭, 입력 등 사용자 행동을 처리할 때 사용한다.

```jsx
function Button() {
  function handleClick() {
    alert('클릭했어!');
  }

  return <button onClick={handleClick}>눌러봐</button>;
}
```

JSX에서는 onClick, onChange, onSubmit 등의 이벤트 이름이 camelCase로 쓰인다.

# 6. 조건부 렌더링

상황에 따라 다른 UI를 보여줄 수 있다.

```jsx
function Greeting({ isLogin }) {
  return <h1>{isLogin ? '환영합니다!' : '로그인해주세요'}</h1>;
}
```

Next.js에서도 로그인 상태, 데이터 유무 등에 따라 조건부 렌더링이 자주 쓰인다.

# 7. 리스트 렌더링 (.map())

배열 데이터를 UI로 변환할 때 사용한다.

```jsx
const fruits = ['사과', '바나나', '포도'];

function FruitList() {
  return (
    <ul>
      {fruits.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
```

React에서 반복 렌더링 시 key는 꼭 넣어야 한다 (고유 식별자 역할).

# 8. useEffect (컴포넌트 생명주기)

컴포넌트가 렌더링될 때, 변경될 때, 사라질 때 특정 코드를 실행한다.

```jsx
import { useEffect } from 'react';

function Hello() {
  useEffect(() => {
    console.log('컴포넌트가 처음 렌더링됨');
  }, []); // 빈 배열이면 '처음 한 번만' 실행

  return <p>Hello, world!</p>;
}
```

Next.js의 클라이언트 컴포넌트에서도 useEffect는 데이터 요청 등에서 자주 사용된다.

# 9. 컴포넌트 구조화

큰 페이지를 여러 작은 컴포넌트로 쪼개서 관리한다.

```css
components/
 ├── Header.js
 ├── Footer.js
 └── ProductCard.js

pages/
 ├── index.js
 └── about.js
```

Next.js의 app/ 또는 pages/ 디렉토리 구조는 이런 컴포넌트 기반 설계 원칙에서 나왔다.

# 10. 데이터 전달 흐름

React는 단방향 데이터 흐름(Top-down) 을 따른다.
부모 → 자식 방향으로만 props 전달이 가능하고, 자식이 부모에게 전달하려면 이벤트 콜백을 사용해야 한다.

```jsx
function Child({ onSend }) {
  return <button onClick={() => onSend('안녕!')}>전송</button>;
}

function Parent() {
  function handleMessage(msg) {
    console.log('자식으로부터:', msg);
  }

  return <Child onSend={handleMessage} />;
}
```
