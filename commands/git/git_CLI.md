# Git CLI 명령어 가이드

# 초기 세팅

**< 사용자 정보 등록 (처음 1회만) >**
git config --global user.name "레온"
git config --global user.email "leon@example.com"

**< 설정 확인 >**
git config --list

**< 도움말 보기 >**
git help <명령어>

# 저장소 관리

**< 새 저장소 초기화 >**
git init

**< 원격 저장소 처음 등록 후 푸시 >**
git push -u origin main # 이후엔 git push만 입력해도 된다.

**< 기존 원격 저장소 연결 >**
git remote add origin <깃허브 주소>

**< 연결된 원격 저장소 확인 >**
git remote -v

**< 원격 저장소 복제(clone) >**
git clone <깃허브 주소>

# 브랜치

**< 브랜치 생성 >**
git branch feature/login

**< 브랜치 이동 >**
git checkout feature/login

**< 브랜치 생성 + 이동 >**
git checkout -b feature/login

**< 브랜치 목록 보기 >**
git branch

**< 원격 브랜치 목록 >**
git branch -r

**< 브랜치 삭제 (로컬) >**
git branch -d feature/login

**< 강제 삭제 >**
git branch -D feature/login

# 변경사항 추적

**< 현재 상태 확인 >**
git status

**< 변경된 파일 비교 >**
git diff

**< 변경된 파일 추가 (스테이징) >**
git add <파일명>
git add . // 전체 추가

**< HEAD 이동 이력 보기 >**
git reflog

# 커밋 & 로그

**< 커밋 생성 >**
git commit -m "feat: 로그인 기능 추가"

**< 최근 커밋 로그 >**
git log

**< 한 줄 요약 로그 >**
git log --oneline

**< 커밋 로그 한 줄씩 보기 >**
git log --pretty=oneline

**< 최근 n개 로그만 >**
git log -n 3

**< 특정 커밋 상세 보기 >**
git show [커밋 ID]

**< 명령어 별칭(alias) 등록 >**
git config alias.[별명] [명령어]

**< 두 커밋 간의 차이 비교 >**
git diff [커밋A ID] [커밋B ID]

**< 특정 커밋에 태그 붙이기 >**
git tag [태그명] [커밋 ID] # git tag v1.0.0

# 원격 저장소 동기화

**< 원격 저장소 변경 가져오기 >**
git pull origin main

**< 커밋 업로드 >**
git push origin feature/login

**< 강제 푸시 (주의!) >**
git push -f origin feature/login

**< 원격 저장소의 최신 상태 가져오기 (fetch) >**
git fetch # 리모트의 최신 브랜치 정보를 가져오지만, 로컬 코드에는 적용하지 않는다.

**< 파일별 변경자 확인(blame) >**
git blame [파일명]

# 병합 & 리베이스

**< 브랜치 병합 (현재 브랜치로) >**
git merge feature/login

**< 병합 충돌 해결 후 커밋 >**
git add .
git commit -m "fix: merge conflict resolved"

**< 머지 충돌 시 취소 >**
git merge --abort

**< 리베이스 (커밋 히스토리 깔끔하게) >**
git rebase main

**< 브랜치 리베이스 >**
git rebase [브랜치명] # A 브랜치 커밋을 B 브랜치 이후로 이어붙인다.

# 복구 / 리셋

**< 특정 파일 수정 취소 >**
git checkout -- <파일명>

**< 스테이징 취소 >**
git reset <파일명>

**< 커밋 되돌리기 (변경 유지) >**
git reset --soft HEAD~1

**< 완전 되돌리기 (변경 삭제) >**
git reset --hard HEAD~1

**< 특정 커밋으로 되돌리기 >**
git revert <커밋ID>

# PR (Pull Request) 흐름 요약

**< 1. 작업 브랜치 생성 >**
git checkout -b feature/imageUpload

**< 2. 커밋 및 푸시 >**
git add .
git commit -m "feat: 이미지 업로드 기능 추가"
git push origin feature/imageUpload

**< 3. GitHub에서 PR 생성 → main 혹은 dev에 머지 >**

# 기타 유용한 명령어

**< 커밋 이력 그래프 보기 >**
git log --graph --oneline --decorate

**< 작업 임시 저장 (stash) >**
git stash # 현재 변경 사항을 임시로 저장하고 워킹 디렉토리를 깨끗하게 만든다.

**< 임시 저장된 작업 적용 >**
git stash apply [stash ID] # 가장 최근(또는 지정한) stash를 적용한다.

**< 임시 저장된 작업 삭제 >**
git stash drop [stash ID] # 지정한 stash를 삭제한다.

**< 적용 + 삭제 동시에 (pop) >**
git stash pop [stash ID] # tash를 적용하면서 목록에서 제거한다.

**< 특정 커밋 가져오기 >**
git cherry-pick [커밋 ID] # 다른 브랜치의 특정 커밋을 현재 브랜치에 반영한다.

**< 커밋 메시지 수정 >**
git commit --amend

**< 캐시 초기화 >**
git rm --cached <파일명>

**< 특정 파일 .gitignore 적용 안 됐을 때 강제 캐시 삭제 후 다시 커밋 >**
git rm --cached <파일명>
git add <파일명>
git commit -m "fix: gitignore 적용"
