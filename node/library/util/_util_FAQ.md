# axios

## 인터셉터가 대체 뭔데?

_결론_
인터셉터 = Axios 요청·응답 도중에 “끼어드는 미들웨어”
Express의 app.use()가 요청을 가로채듯이,
Axios는 HTTP 요청이 나가기 직전과 응답이 들어오기 직전에,
공통 코드를 끼워 넣을 수 있는 기능을 제공한다.
아주 강력한 개념이라 실무에서 많이 쓰인다.

_예시_

1. `요청 인터셉터(Request Interceptor)`
   \_ “요청 보내기 전에 무조건 실행되는 함수”
   JWT 토큰 자동으로 헤더에 붙이기
   모든 요청 주소 로그 찍기
   특정 조건에서 요청 취소하기
   공통 헤더 넣기

   ```js
   api.interceptors.request.use((config) => {
     console.log('요청 보냄:', config.url);

     const token = localStorage.getItem('token');
     config.headers.Authorization = `Bearer ${token}`;

     return config;
   });
   ```

   이제 모든 Axios 요청에 토큰이 알아서 붙는다.

2. `응답 인터셉터(Response Interceptor)`
   \_ “서버 응답을 받은 뒤, 코드에 전달되기 직전에 실행되는 함수”
   응답(200) 데이터 공통 가공
   에러 처리 공통화
   401(토큰 만료)일 때 자동 로그아웃

   ```js
   api.interceptors.response.use(
     (res) => {
       console.log('응답 성공:', res.status);
       return res;
     },
     (err) => {
       if (err.response.status === 401) {
         console.log('토큰 만료 → 자동 로그아웃');
       }
       return Promise.reject(err);
     }
   );
   ```

   모든 API 응답 에러를 한 곳에서 처리할 수 있다.

_프론트/백에서 인터셉터를 왜 많이 쓸까?_

1. `중복 제거`
   토큰 붙이는 코드가 매번 반복되는 건 지옥이다.
   그래서 인터셉터 1줄이면 해결 가능하다.

2. `에러 처리를 “한 곳에서” 관리`
   페이지마다 try-catch 반복할 필요 없다.

3. `응답 구조 통일 가능`
   API마다 res.data.data, res.data.result 등 달라도 인터셉터에서 통일해버릴 수 있다.

_비유_
Axios 요청은 “우체국에서 편지 보내는 것”이고,
터셉터는 편지가 나가기 전에 붙이는 자동 스탬프 같은 것이다.
요청 인터셉터 → 편지 봉투에 자동으로 토큰 스탬프 찍기
응답 인터셉터 → 돌아온 편지 검사해서 에러면 자동으로 처리
매 요청마다 적을 필요 없이 공통 작업을 자동으로 해준다.

# express-rate-limit

## 게임 사이트에서 로그인 실패 반복으로 제한 걸린 것도 이런 경우야?

_결론_
로그인 반복 제한 시스템이 express-rate-limit 같은 Rate Limit 기술로 구현된 것이다.
말 그대로, "로그인 시도가 많네? 혹시 공격인가? 잠깐 쉬고 다시 해!"라는 보안 장치다.

1. `게임/은행/쇼핑몰 로그인에서 보던 그 메시지`
   예를 들어 이런 메시지들,
   “비정상적인 로그인 시도가 감지되었습니다.”
   “잠시 후 다시 시도해주세요.”
   “로그인 시도가 너무 많습니다.”
   이런 건 대부분 Rate Limiting(요청 횟수 제한)으로 처리한다.
   Node.js 쪽에서는 express-rate-limit으로 구현하는 경우가 많고,
   대형 서비스는 보통 Nginx, Cloudflare, AWS WAF 같은 상위 보안 레이어에서 함께 건다.

2. `왜 꼭 필요한 기능인가?`

   1. `브루트포스 공격 방지`
      비밀번호를 무한 대입하는 공격을 차단함.
   2. `봇/스크립트 반복 호출 방지`
      특히 로그인, 인증번호 요청, 비밀번호 찾기 같은 엔드포인트.
   3. `서버 보호(DoS 완화)`
      로그인 API 계속 두드리면 서버 부하 생기잖아? 그거 막는 역할.

3. `express-rate-limit으로 게임서버 느낌 구현해보면?`

   ```js
   const loginLimiter = rateLimit({
    windowMs: 1 _ 60 _ 1000, // 1분
    max: 5, // 5번 시도 가능
    message: '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.',
   });
   ```

   5번 연속 시도하면, status: 429, message: “잠시 후 로그인해주세요.”
   바로 네가 말한 그 “게임 로그인 잠시 후 시도해주세요” 메시지가 뜬다.

4. `심지어… 프론트도 이걸 파악해서 UI 띄워`
   백엔드 → 429 상태코드 + 경고 메시지
   프론트 → 팝업 띄우기 / 로그인 버튼 비활성화
   이런 식으로 연결되는 것이다.

# uuid

## node.js 자체 uuid 내장 모듈이 있는데 설치 할 필요나 차이가 있어?

_결론_
Node 최신 버전 + Prisma 최신 버전이면,
사실 uuid 라이브러리 없이도 대부분의 UUID 사용을 대체할 수 있다.

1. `Node.js 최신 버전: crypto.randomUUID()`
   Node 14.17+ 부터 도입된 공식 내장 UUID 생성기.

   ```js
   import crypto from 'crypto';
   crypto.randomUUID();
   // → 'ee42ea01-f6b4-40c2-b78f-1b21e45ea428'
   ```

   _장점_
   내장 기능 → 설치 불필요, 속도 빠름, uuid v4 표준 완벽 준수, 보안 특성 강함 (CSPRNG 기반)
   _단점_
   UUID v4만 제공, 환경에 따라 아직 구버전 Node에서 사용할 수 없음

2. `Prisma: @id @default(uuid())`
   Prisma는 스키마 단계에서 UUID를 자동 생성한다

   ```prisma
   id String @id @default(uuid())
   ```

   _장점_
   DB 레벨에서 자동으로 ID 생성, 프론트/백에서 ID 값을 만들 필요 없음, race condition 걱정 없음, Prisma migrate/seed 구조와 잘 맞음
   _단점_
   DB에 넣기 전 단계에서 ID가 필요한 경우에는 사용 불가

3. `uuid 패키지 (uuid 라이브러리)`
   _솔직한 현실_
   Node 최신 + Prisma 최신 → uuid 패키지의 필요성이 크게 줄어든 건 사실이다.
   하지만 uuid 패키지가 여전히 쓰이는 이유가 있다.
   - Node 버전 낮아서 randomUUID() 없음
   - v1, v3, v5가 필요한 경우
   - 레거시 코드 유지보수

_요약_
uuid 패키지는 거의 필요 없다.
실무 현장에서 쓰이는 방식에 따라 선택하면 된다.
