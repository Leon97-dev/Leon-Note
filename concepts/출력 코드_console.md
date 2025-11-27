# console 개념 정리

- `console.log()`: 일반 로그
  \_ 가장 기본적인 출력. 상태, 흐름, 변수값 확인용
  \_ console.log('서버 실행됨:', port)

- `console.error()`: 에러 로그
  \_ 실제 오류 상황에 사용 (빨간색으로 표시됨)
  \_ console.error('DB 연결 실패:', err.message)

- `console.warn()`: 경고 로그
  \_ 에러는 아니지만 이상 징후 있을 때 (노란색)
  \_ console.warn('예상치 못한 Content-Type:', type)

- `console.info()`: 정보 로그
  \_ 주요 정보나 초기화 메시지용 (파란색 or 회색)
  \_ console.info('🚀 서버 준비 완료')

- `console.table()`: 표 로그
  \_ 배열/객체를 표로 시각화 (디버깅 시 깔끔)
  \_ console.table(users)

- `console.time(label)/console.timeEnd(label)`: 실행 시간 측정 로그
  \_ 코드 블록의 처리 속도 측정용
  \_ console.time('query');await prisma.user.findMany();console.timeEnd('query');

**< 추가로 유용한 메소드 (선택적) >**

- `console.group(label)/console.groupEnd()`: 관련 로그를 그룹화
  \_ onsole.group('상품 업로드');console.log('파일:', req.file);console.groupEnd();

- `console.assert(condition, msg)`: 조건이 false일 때만 출력
  \_ console.assert(user, '❌ user가 존재하지 않음!')
