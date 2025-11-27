// app/layout.js
export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <header style={{ background: '#eee', padding: '10px' }}>
          <h2>공통 헤더</h2>
        </header>
        <main>{children}</main>
        <footer style={{ background: '#eee', padding: '10px' }}>
          <p>공통 푸터</p>
        </footer>
      </body>
    </html>
  );
}
