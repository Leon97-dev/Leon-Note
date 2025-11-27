# 현업 에서 가장 많이 쓰는 응답 형태는 딱 2가지

1. 성공 응답 표준 (대부분의 회사가 이걸 사용)

```json
{
  "success": true,
  "message": "회원가입 완료",
  "data": {
    "userId": 1,
    "email": "test@test.com"
  }
}
```

네이버 · 카카오 · 토스 · 금융 API들이 거의 이 구조.

2. 에러 응답 표준

error-handler 구조가 정확히 이 표준과 동일함.

```json
{
  "success": false,
  "message": "이메일이 이미 존재합니다",
  "error": "CONFLICT",
  "path": "email"
}
```

프론트가 input 필드에 어떤 에러인지 쉽게 반영 가능
error-code 로 조건 분기 가능
