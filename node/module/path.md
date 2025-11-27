# Node.js 내장 모듈 — path

_참고 사이트_
https://nodejs.org/api/path.html

1️⃣ 개요

파일 경로를 다루는 Node.js 내장 유틸리티다.
운영체제(Windows, macOS, Linux)에 따라 경로 구분자 / 또는 \ 가 다르기 때문에,
path를 사용하면 운영체제에 상관없이 안전하게 경로를 조작할 수 있다.

import path from 'path'; ❌ 설치 불필요

2️⃣ 주요 역할

- 파일 경로 연결 (join, resolve)
- 확장자 / 파일명 추출 (extname, basename)
- 디렉터리 이름 추출 (dirname)
- 경로를 절대경로로 변환 (resolve, normalize)
- 운영체제 구분자 관리 (sep, delimiter)

3️⃣ 주요 메서드 정리

**< path.join([...paths]) >**
경로를 OS 규칙에 맞게 안전하게 연결한다.
자동으로 불필요한 / 나 \를 정리한다.

```js
const filePath = path.join('src', 'uploads', 'images', 'photo.png');
console.log(filePath);
// macOS/Linux → 'src/uploads/images/photo.png'
// Windows → 'src\uploads\images\photo.png'
```

**< path.resolve([...paths]) >**
상대 경로를 절대 경로로 변환한다.
기준은 현재 작업 디렉터리`(process.cwd())`

```js
const fullPath = path.resolve('src', 'app.js');
console.log(fullPath);
// 예: /Users/leon/project/src/app.js
```

**< path.basename(p, [ext]) >**
경로에서 파일명만 추출한다.
ext를 지정하면 확장자 제거 가능하다.

```js
const file = path.basename('/src/app/config.json');
console.log(file); // config.json

const fileNoExt = path.basename('/src/app/config.json', '.json');
console.log(fileNoExt); // config
```

**< path.dirname(p) >**
경로의 디렉터리 이름만 추출한다.

```js
const dir = path.dirname('/src/app/config.json');
console.log(dir); // /src/app
```

**< path.extname(p) >**
파일의 확장자를 추출한다.

```js
const ext = path.extname('image.jpeg');
console.log(ext); // .jpeg
```

**< path.normalize(p) >**
불필요한 슬래시(//)나 .. 등을 정리해 정상적인 경로 형태로 정돈한다.

```js
const normalized = path.normalize('src//uploads/../images//photo.png');
console.log(normalized); // 'src/images/photo.png'
```

**< path.parse(p) >**
경로를 객체 형태로 분해한다.

```js
const info = path.parse('/home/user/docs/file.txt');
console.log(info);
// {
//   root: '/',
//   dir: '/home/user/docs',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file'
// }
```

**< path.format(obj) >**
parse()로 분해한 객체를 다시 경로 문자열로 합친다.

```js
const p = path.format({
  dir: '/home/user/docs',
  name: 'file',
  ext: '.txt',
});
console.log(p); // /home/user/docs/file.txt
```

4️⃣ 경로 관련 상수

- `path.sep`: 경로 구분자
  \_ / (mac, linux), \ (windows)

- `path.delimiter`: 환경 변수 구분자
  \_ : (mac, linux), ; (windows)

5️⃣ 활용 예시

**< 업로드 폴더 경로 생성 >**

```js
const uploadPath = path.join(process.cwd(), 'src', 'uploads');
console.log(uploadPath);
```

**< 특정 파일의 확장자 검사 >**

```js
const file = 'image.png';
if (path.extname(file) !== '.png') {
  console.log('PNG 파일만 허용됩니다.');
}
```

**< 서버 루트 기준 절대경로 변환 >**

```js
const configPath = path.resolve('config', 'server.json');
console.log(configPath);
```
