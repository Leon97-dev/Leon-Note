# OAuth 기본 개념

OAuth는 외부 서비스(Google, Kakao, Naver, GitHub 등)의 **인증 서버를 이용해 로그인하는 방식**이다.  
즉, 우리 서버는 사용자의 비밀번호를 직접 다루지 않고,  
외부 서비스가 제공한 “승인된 사용자 정보”만 받아 활용한다.

---

# 설치 명령어

npm install \
 passport-google-oauth20 \
 passport-github2 \
 passport-kakao \
 passport-naver-v2 \

---

# 1. 왜 OAuth를 쓰는가?

**< 비밀번호를 직접 저장/관리하지 않아도 됨 >**
사용자가 Google 또는 Kakao에서 로그인하면,  
우리 서버는 단순히 "이 사람이 인증됨"이라는 신호만 받는다.

**< 회원가입/로그인 과정이 빨라짐 >**
복잡한 입력 없이 버튼 한 번으로 가입.

**< 보안적으로 더 안전 >**
비밀번호 탈취 위험 ↓  
외부 서비스의 강력한 MFA(2차 인증) 보안 활용 ↑

---

# 2. OAuth 로그인 흐름

1. `사용자가 외부 서비스 로그인 페이지로 이동`
   → 구글/카카오/네이버/깃허브 로그인 화면

2. `로그인 성공 후 우리 서버의 callback URL로 리다이렉트`
   → 이때 Authorization Code 또는 AccessToken이 함께 도착

3. `우리 서버가 외부 API를 호출하여 사용자 정보를 가져옴`  
   → 예: 이메일, 이름, 프로필 이미지 등

4. `DB에 사용자 존재 여부 확인 후 회원가입/로그인 처리`
   → 신규면 회원가입  
   → 기존이면 로그인

5. `세션 또는 JWT 발급 후 클라이언트에 응답`

---

# 3. OAuth 인증 방식 (Code Flow)

거의 모든 OAuth는 기본적으로 아래 방식이다.

1. `Authorization Request`
   사용자를 외부 로그인 페이지로 보냄.

2. `Authorization Code 응답`

3. `Token Exchange`
   우리 서버가 code를 사용해 token 요청

4. `User Info 가져오기`

5. `DB 저장 및 로그인 처리`  
   세션 / JWT 발급

---

# 4. 어떤 OAuth를 배워야 할까?

실무에서 거의 99% 쓰는 4대 OAuth!

- 🔵 Google OAuth 2.0 (가장 보편적, 표준적인 구조)
- 🟡 Kakao Login (한국 서비스 필수)
- 🟢 Naver Login (국내 서비스 보조)
- ⚫ GitHub OAuth (개발자 서비스 필수)

구조는 모두 비슷하지만,
**URL / 데이터 구조 / scope / 전략 설정**만 조금씩 다르다.

---

# 5. Passport로 OAuth 구현 시 필요한 파일 구조

```bash
src/
 └─ config/
      └─ passport/
           ├─ strategies/
           │     ├─ google.js
           │     ├─ kakao.js
           │     ├─ naver.js
           │     └─ github.js
           └─ index.js    # passport.use() 등록
```

---

# 6. 세션 방식·JWT 방식과의 관계

- Local + Session: 이메일/비번 기반 로그인
- Local + JWT: API 서버, 모바일 백엔드에서 사용
- OAuth + Session: 대부분의 웹 서비스 기본
- OAuth + JWT: SPA(React/Next), 모바일 앱에서 자주 사용

즉 OAuth는 세션 기반 또는 JWT 기반의 로그인 방식을 확장하는 것일 뿐, 완전히 별개의 인증이 아니다.

---

# 7. 실무 팁

✔ OAuth는 결국 “사용자 정보 가져오기”가 핵심

회원가입 처리와 세션 발급은 기존 로직을 그대로 사용

✔ Passport는 전략(strategy)을 추가하는 것일 뿐

LocalStrategy처럼 GoogleStrategy / KakaoStrategy를 추가하는 방식

✔ redirect_uri는 반드시 정확히 일치해야 한다

https mismatch, trailing slash 때문에 에러 많이 발생

✔ 클라이언트(client_id, client_secret)는 절대 Git에 올리지 말 것
