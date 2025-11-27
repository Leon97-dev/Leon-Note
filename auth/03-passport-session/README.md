# 세션 기반 + passport 인증 시스템

passport & passport-local 설치
npm i passport passport-local

---

# 일반 세션이랑 passport 세션 쿠키 사용 여부

1️⃣ 일반 세션 방식에서는 cookie-parser가 필요한 이유
express-session만 쓸 때는 세션 미들웨어가 쿠키를 “설정(Set)”하긴 하지만,
서버가 클라이언트에서 쿠키를 읽을 때는 cookie-parser가 있어야 req.cookies 객체에 접근할 수 있다.

- cookie-parser: req.cookies 안에 쿠키 데이터를 파싱해서 넣어줌
- express-session: 세션 쿠키(sid)를 응답 시 생성하고 관리함

req.cookies.sid 같은 걸 직접 보거나 디버깅할 일이 있으니, cookie-parser를 함께 써야한다.

2️⃣ Passport 방식에서는 왜 안 써도 되는가?
Passport를 쓸 때는 로그인·세션 복원 과정이 이렇게 작동한다.

1. 클라이언트가 요청을 보냄 (sid 쿠키 자동 포함)
2. express-session이 자동으로 쿠키를 읽고,
   세션 스토어(DB)에서 유저 정보를 찾아서 req.session에 복원
3. passport.session() 미들웨어가 req.session에서 req.user로 자동 복사
4. 이후 컨트롤러에서 req.user만 쓰면 됨

즉, Passport는 cookie-parser 없이도 세션 쿠키를 내부적으로 읽어 처리한다.
왜냐면 express-session이 이미 쿠키를 파싱하고 있기 때문에 쓸 필요가 없다.
