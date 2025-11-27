# Git 관련 파일 & 폴더 정리

# .gitignore

Git이 추적하지 말아야 할 파일/폴더 목록을 정의하는 설정 파일이다.
(빌드 산출물, 환경 변수, IDE 설정 파일 등은 반드시 제외)

```bash
# 환경 변수
.env

# 의존성 폴더
node_modules/

# 로그 / 캐시
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# 빌드 결과물
dist/
build/

# 운영 배포용 압축 파일
*.zip
*.tar

# 시스템/IDE 파일
.DS_Store
Thumbs.db
.vscode/
.idea/

# Prisma
prisma/dev.db
```

# .gitkeep

Git은 빈 폴더는 저장하지 않는다.
그래서 폴더 구조를 유지하려고 의도적으로 넣는 빈 파일이다.

```bash
uploads/
┣ .gitkeep ← 폴더만 유지할 때
```

_Tip_
팀에서는 주로 업로드 디렉터리(uploads/, temp/, cache/ 등)에 넣는다.
CI/CD나 서버 환경에서 이 폴더가 존재하지 않으면 런타임 에러가 날 수도 있다.

# .gitattributes

Git이 파일을 다루는 방식을 제어하는 파일이다.
예를 들어 EOL(Line Ending) 정책, 병합 전략, diff 표시 형식 등을 지정한다.

```bash
# 텍스트 파일의 줄바꿈 형식 통일 (LF)
* text=auto eol=lf

# 특정 파일 확장자는 바이너리로 간주
*.png binary
*.jpg binary

# Markdown 파일은 diff 제외
*.md diff=off
```

_Tip_
윈도우/맥 협업 시 “줄바꿈 문자(EOL)” 꼬임 방지용으로 자주 사용한다.

# .gitmodules

프로젝트에 다른 Git 저장소를 서브모듈로 포함할 때 생긴다.
예를 들어 백엔드 레포에 공통 모듈이나 프론트엔드 서브 프로젝트 포함할 때 생긴다.

```ini
[submodule "frontend"]
    path = frontend
    url = https://github.com/yourteam/frontend.git
```

_Tip_
git submodule update --init --recursive 명령어로 서브모듈까지 함께 가져와야 한다.

# .gitlab-ci.yml / .github/workflows/

CI/CD(자동 빌드·배포 설정) 파일
플랫폼(GitHub, GitLab)에 따라 이름이 다르다.

- .github/workflows/deploy.yml → GitHub Actions
- .gitlab-ci.yml → GitLab CI/CD

_Tip_
이 파일들이 있으면 “코드 푸시 → 테스트 → 빌드 → 배포” 자동화가 가능하다.

# 기타 숨김 설정 파일들

- `.prettierrc, .eslintrc`: 코드 스타일 및 린트 규칙
- `.nvmrc`: Node.js 버전 고정용
- `.env.example`: 환경 변수 템플릿 (실제 .env는 .gitignore로 제외)
- `.editorconfig`: 에디터 간 들여쓰기/라인 규칙 통일

# 실무 추천 폴더 구조 (Node.js 백엔드 예시)

```bash
project-root/
 ┣ src/
 ┣ prisma/
 ┣ uploads/
 ┃ ┗ .gitkeep
 ┣ logs/
 ┃ ┗ .gitkeep
 ┣ .env
 ┣ .env.example
 ┣ .gitignore
 ┣ .gitattributes
 ┣ .prettierrc
 ┣ package.json
 ┗ README.md
```
