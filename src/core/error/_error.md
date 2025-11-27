# 백엔드 에러/디버그 핵심 4종 세트

# 1. async-handler.js

비동기 컨트롤러에서 throw 된 에러를 자동으로 error-handler에게 전달하는 필수 미들웨어다.
→ 이거 없으면 Express는 async 에러를 잡지 못함.
→ 현업에서도 100% 사용함.

---

# 2. createError.js

반복되는 에러 생성 코드를 단일 함수로 통일.
throw createError(409, "중복 이메일") 이런 식으로 깔끔하게 사용.

→ 실무에서 항상 쓰는 패턴.
→ 유지보수성↑, 컨트롤러 가독성↑

---

# 3. debug.js

개발 중에만 디버깅 로그 출력.
배포에서는 자동으로 조용해짐.

→ 실무에서도 Debug 플래그 방식은 흔히 쓰는 기법.
→ loggers(pino/winston) 도입 전까지는 이걸로 충분함.

---

# 4. error-handler.js

throw 된 모든 에러를 마지막에서 JSON으로 깔끔하게 응답.
에러 로그도 여기서 통일 처리.

→ 모든 Express 프로젝트가 이 파일을 반드시 가짐.

# 5. logger.js

콘솔 출력 + 파일 저장 + 날짜별 회전(log rotation)
에러/정보/경고 로그 분리
서버 운영/배포 환경에서 무조건 필요한 기능
즉, 서버 전체의 로깅 시스템을 담당함.

# 폴더 트리 추천

```bash
src/
└── core/
    ├── error/
    │   ├── async-handler.js
    │   ├── createError.js
    │   ├── debug.js
    │   └── error-handler.js
    └── logger/
        └── index.js   # winston 기반 logger
```
