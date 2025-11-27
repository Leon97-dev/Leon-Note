# Unix / Linux / macOS CLI 명령어 가이드

# 현재 위치 확인

pwd

# 디렉터리 목록 보기

ls
ls -al # 숨김 파일 포함, 상세 보기

# 디렉터리 이동

cd <경로>
cd .. # 상위 폴더로 이동
cd ~ # 홈 디렉터리로 이동

# 디렉터리 생성

mkdir <폴더명>
mkdir -p src/routes # 하위폴더까지 한 번에 생성

# 파일 생성

touch <파일명>
touch index.js

# 파일 내용 보기

cat <파일명>
cat package.json

# 파일 복사

cp <원본> <복사본>
cp .env.example .env

# 파일 이동/이름 변경

mv <원본> <새이름>
mv index.js app.js

# 파일/폴더 삭제

rm <파일명>
rm -rf <폴더명> # 강제 삭제 (주의!)

# 프로세스 확인

ps aux | grep node # node 관련 프로세스 확인

# 포트 강제 종료

lsof -i :3000 # 3000번 포트 사용중 프로세스 확인
kill -9 <PID> # PID 프로세스 강제 종료

# 현재 실행 중인 프로세스 실시간 확인

top

# 파일 내용 검색

grep "단어" <파일명>
grep -r "env" ./src

# 현재 디스크 용량 확인

df -h

# 현재 폴더 용량 확인

du -sh .

# 권한 변경

chmod 755 <파일명> # 읽기/쓰기/실행 권한 부여

# 파일 소유자 변경

chown <유저명>:<그룹명> <파일명>

# 환경 변수 확인

echo $PATH
echo $HOME

# 환경 변수 설정

export NODE_ENV=development

# 실행 중인 Node 프로세스 모두 종료

pkill node

# 터미널 정리

clear

# 현재 시간 확인

date

# 네트워크 연결 확인

ping google.com

# 서버 IP 확인

ifconfig / ip addr show

# 현재 사용자 확인

whoami

# 루트 권한 명령 실행

sudo <명령어>

# 로그 실시간 보기

tail -f <로그파일>

# 디비 존재 확인

psql -U leon -d postgres

\l

디비가 없을 시 생성해야 함

\q -> 나가기 버튼

CREATE DATABASE <디비 이름>;

그리고 npx prisma migrate dev
