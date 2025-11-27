# http 상태 코드 정리

- `200`: OK
  \_ 정상 요청 처리

- `201`: Created
  \_ 새로운 리소스 생성 성공 (회원가입 성공 시)

- `400`: Bad Request
  \_ 요청 형식이 잘못됨 (필드 누락, JSON 깨짐 등)

- `401`: Unauthorized
  \_ 인증 실패 (로그인 실패, 토큰 없음)

- `403`: Forbidden
  \_ 권한 부족

- `404`: Not Found
  \_ 리소스 없음

- `409`: Conflict
  \_ 리소스 충돌 (이미 존재 등)

- `500`: Internal Server Error
  \_ 서버 내부 오류
