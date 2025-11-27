# Nodemon — 서버 자동 재시작 개발 도구

_참고 사이트_
https://github.com/remy/nodemon

---

# 1. 개요

Nodemon은 Node.js 개발 환경에서 파일이 변경될 때마다 서버를 자동으로 재시작해주는 도구다.
매번 node app.js를 다시 실행할 필요가 없어 개발 속도를 크게 높여준다.

npm i --save-dev nodemon ✅ 설치 필요

---

# 2. 주요 역할

운영(production)에서는 절대 사용하지 않고, 오직 개발 과정에서만 사용된다.

- 코드 변경 시 서버 자동 재시작
- 특정 경로/확장자만 감시 가능
- 커맨드 자동 실행
- 개발 환경(dev) 전용 도구

---

# 3. 기본 실행

프로젝트에서 nodemon을 직접 실행

```bash
npx nodemon src/app.js
```

하지만 일반적으로 npm script로 사용한다.

---

# 4. npm scripts 설정

package.json

```json
{
  "scripts": {
    "dev": "nodemon src/app.js"
  }
}
```

실행 → 파일 수정 시 자동 재시작

```bash
npm run dev
```

---

# 5. Nodemon 설정 파일(.nodemon.json)

프로젝트 루트에 생성

```json
{
  "watch": ["src"],
  "ext": "js,json",
  "ignore": ["node_modules"],
  "exec": "node src/app.js"
}
```

- watch: 감시할 디렉터리
- ext: 감시할 확장자
- ignore: 제외할 폴더
- exec: 실행할 명령어

---

# 6. 파일 감시 대상 제한

예: src만 감시하고 uploads/log 폴더는 제외

```json
{
  "watch": ["src"],
  "ignore": ["uploads", "logs"]
}
```

---

# 7. TypeScript와 함께 쓰는 경우

**< ts-node + nodemon 조합 >**

```bash
npm i --save-dev ts-node
```

.nodemon.json

```json
{
  "watch": ["src"],
  "exec": "ts-node src/app.ts",
  "ext": "ts"
}
```

---

# 8. 실무에서 사용되는 이유

- API 작업할 때 수정 후 자동 리로드
- 프로젝트 초반 개발 속도 상승
- Express 서버 개발 시 거의 필수
- TypeScript와 함께 사용하기 편함

단순하지만 없어지면 바로 불편함을 느끼는 도구다.
