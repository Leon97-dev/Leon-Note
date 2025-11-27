# Unix 기본 개념

## ✦ 의도

UNIX는 macOS, Linux(우분투 등), 서버 환경, Docker, CI/CD, 배포 등
현대 개발 생태계 거의 모든 기반에 숨어 있는 철학이다.
Node.js 백엔드 개발에도 UNIX 개념은 계속 등장한다:

- 터미널 명령어
- 권한
- 프로세스
- 환경변수
- 파일 경로
- 배포 & 서버 관리

이 문서는 “백엔드 개발자가 실무에서 직접 느끼는 UNIX의 핵심 개념”을 정리한다.

---

## ✦ UNIX란 무엇인가?

UNIX는 운영체제(Operating System) 중 하나이며,
“철학과 구조”가 강하게 정해진 시스템이다.

macOS → BSD 기반 UNIX
Linux(우분투, CentOS 등) → UNIX 철학을 계승한 시스템

macOS 터미널에서 쓰는 명령어 대부분이 UNIX 구조 위에서 동작한다.

---

## ✦ UNIX 철학 (Unix Philosophy)

UNIX를 이해하는 핵심은 바로 이 3가지다.

### ✔ 1) 하나의 프로그램은 하나의 일만 잘하라

작은 기능을 가진 도구(tool)를 만들고 복잡한 기능은 도구들을 조합해서 만든다.

예시:
ls는 목록만
cat은 파일 출력만
grep은 검색만
sed는 치환만
awk는 패턴 처리만

→ 이것들을 파이프 | 로 연결하여 큰 기능을 만든다.

### ✔ 2) 텍스트는 가장 유연한 인터페이스다

많은 UNIX 도구는 텍스트 기반으로 입출력한다.
Node.js 프로그램도 결국 표준입출력(stdout, stdin)을 사용하므로
UNIX 도구들과 쉽게 연결된다.

### ✔ 3) 도구들을 연결해 조합 가능하게 만들라

파이프 | 를 통해 명령 결과를 다음 명령의 입력으로 전달한다.

```bash
ls | grep "log" | wc -l
```

이런 파이프 기반 처리 방식이 Node.js 스트림 API에도 그대로 적용된다.

---

## ✦ UNIX와 백엔드 개발의 연결

UNIX를 왜 알아야 하는가?

### ✔ 1) 터미널 기반 개발 작업

npm, git, npx, pm2, ssh, scp, docker 모두 UNIX 명령 기반.

### ✔ 2) 파일 시스템 구조

Express, Prisma, 환경 변수 로딩 모두 OS의 파일 구조에 의존.

### ✔ 3) 프로세스 관리

node app.js, pm2 start app.js 등등

### ✔ 4) 권한 시스템(perms)

chmod, chown 등은 배포 때!

### ✔ 5) 서버 접속 (SSH)

리눅스 서버에 배포하려면 UNIX 커맨드는 필수.

---

## ✦ 파일 시스템과 경로

### ✔ 절대 경로 / 상대 경로

```bash
/home/ubuntu/app   # 절대경로
./src/utils        # 상대경로
../                # 상위 폴더
```

Node.js에서도 path.resolve, `__dirname` 등이 결국 UNIX 경로 규칙을 따른다.

---

## ✦ 권한 시스템

UNIX의 파일 권한은 다음 3가지 그룹으로 나뉜다:

- Owner (파일 만든 사람)
- Group (소속 그룹)
- Others (그 외 사용자)

권한 유형은 다음 3가지다:

- r 읽기(Read)
- w 쓰기(Write)
- x 실행(Execute)

예시:
-rwxr-xr--
소유자는 읽기/쓰기/실행,
그룹은 읽기/실행,
그 외 사용자는 읽기만.

chmod로 설정한다:
chmod 755 script.sh

---

## ✦ 프로세스와 신호(Signal)

Node 서버 실행 시 프로세스 ID(PID)가 생긴다.

```bash
node server.js   # PID 생성
kill -9 1234     # 강제 종료
```

Docker, PM2, Nginx 모두 process 기반 관리.

---

## ✦ 중요한 UNIX 명령어 요약

### ✔ 디렉토리 / 파일

```bash
ls # 목록
cd # 이동
pwd # 현재 위치
mkdir # 폴더 생성
rm -rf # 삭제 (신중!!)
```

### ✔ 파일 읽기

```bash
cat file.txt
tail -f logs/app.log
```

### ✔ 권한

```bash
chmod
chown
```

### ✔ 프로세스

```bash
ps -ef
kill
top / htop
```

### ✔ 네트워크

```bash
curl
ping
netstat
```

---

## ✦ Pipe(|)와 Redirect(>)

### ✔ 파이프

출력을 다음 명령의 입력으로 전달.

```bash
cat logs/app.log | grep ERROR
```

### ✔ 리다이렉트

파일에 저장.

```bash
node app.js > output.log
```

---

## ✦ Node.js와 UNIX의 실제 연결 예시

① 로그 처리 (winston 파일 출력)
→ 내부적으로 파일 권한, 파일 경로, 파일 스트림 모두 UNIX 사용.

② Prisma Migration

```bash
npx prisma migrate dev
```

→ 실제로 파일 생성/수정은 OS 파일 시스템에서 처리.

③ Docker 실행

```bash
docker run -p 3000:3000 app
```

→ Linux kernel 위에서 동작.

④ SSH 서버 배포

```bash
ssh ubuntu@1.2.3.4
pm2 restart app
```

---

## ✦ 정리

UNIX는 단순한 "운영체제 이름"이 아니라 백엔드 개발 전체를 관통하는 기본 철학이다.
프로그래밍을 깊게 이해할수록 UNIX 철학은 점점 더 강하게 느껴진다.

UNIX 개념만 이해해도 Node.js 백엔드 → Linux 서버 배포 → Docker → CI/CD
로 이어지는 현대 백엔드 스택을 더 쉽게 다룰 수 있다.
