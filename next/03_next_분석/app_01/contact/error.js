// app/contact/error.js
"use client";

export default function ContactError({ error, reset }) {
  return (
    <div>
      <h1>⚠️ 에러 발생!</h1>
      <p>{error.message}</p>
      <button onClick={() => reset()}>다시 시도</button>
    </div>
  );
}

/* ✅ 실습 완료 후 느껴야 할 포인트

폴더 = URL

layout.js는 모든 페이지의 부모

error.js, loading.js 같은 건 페이지 단위 예외 처리 가능

[id] 폴더는 URL 파라미터를 자동으로 매핑 */
