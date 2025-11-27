# Node.js 외부 라이브러리 - Multer

_참고 사이트_
https://github.com/expressjs/multer

---

# 1. 개요

Multer는 Express에서 파일 업로드를 처리하는 미들웨어다.
특히 이미지, 문서 등 multipart/form-data 형식 요청을 자동으로 파싱해준다.

- 파일 저장 위치 지정
- 파일명 커스텀
- 파일 타입 검사
- 폴더 자동 생성 가능(직접 만들거나, fs로 처리)
- 메모리 저장 / 디스크 저장 선택

npm i multer ✅ 설치 필요

---

# 2. 주요 역할

- multipart/form-data 요청 본문 파싱
- 업로드한 파일을 req.file / req.files 에 담아줌
- 로컬 디스크 저장(storage) 설정 → destination, filename 등 설정 가능
- 파일 개수 제한, 크기 제한 등 옵션 제어
- 특정 필드명으로 파일 받기(single, array, fields)

---

# 3. 핵심 개념 정리

**< multer(options) >**
multer 인스턴스를 생성한다.
저장 전략(storage), 파일 제한(limits), 파일 필터(fileFilter) 등을 설정한다.

```js
import multer from 'multer';

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});
```

**< storage: multer.diskStorage(config) >**
파일을 로컬 디스크에 저장할 때 사용하는 전략이다.

```js
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'src/uploads');
  },
  filename(req, file, cb) {
    const unique = Date.now() + '-' + Math.random();
    cb(null, unique + '-' + file.originalname);
  },
});
```

- `destination`: 저장될 폴더
- `filename`: 저장되는 실제 파일 이름
- `cb(err, value)`

**< fileFilter(req, file, cb) >**
업로드 허용/거부를 결정하는 함수다.

```js
function fileFilter(req, file, cb) {
  if (!file.mimetype.startsWith('image/')) {
    cb(new Error('이미지 파일만 업로드 가능합니다.'), false);
  } else {
    cb(null, true);
  }
}
```

- mimetype: image/jpeg, image/png 등등

**< limits >**
파일 제한 옵션. 자주 쓰는 건 fileSize.

```js
limits: {
  fileSize: 5 * 1024 * 1024, // 5MB
}
```

---

# 4. 업로드 메서드 종류

Multer로 업로드를 받을 때, 다음과 같은 방식으로 엔드포인트별로 다르게 처리할 수 있다.

**< upload.single(fieldName) >**
단일 파일 업로드

```js
router.post('/upload', upload.single('image'), (req, res) => {
  console.log(req.file);
  res.json({ file: req.file });
});
```

**< upload.array(fieldName, maxCount) >**
같은 필드로 여러 개 파일

```js
router.post('/photos', upload.array('images', 5), (req, res) => {
  console.log(req.files);
});
```

**< upload.fields([{ name, maxCount }]) >**
서로 다른 필드로 여러 파일

```js
router.post(
  '/mixed',
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'gallery', maxCount: 8 },
  ]),
  (req, res) => {
    console.log(req.files);
  }
);
```

---

# 5. req.file / req.files 구조

업로드에 성공하면 Express의 req 객체에 다음 정보가 생긴다.

**< req.file >**

```js
{
  fieldname: 'image',
  originalname: 'cat.png',
  encoding: '7bit',
  mimetype: 'image/png',
  destination: 'src/uploads',
  filename: '1710669213-cat.png',
  path: 'src/uploads/1710669213-cat.png',
  size: 34912
}
```

---

# 6. 활용 예시

**< 업로드 미들웨어 분리 >**

```js
// src/middlewares/upload.js
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(process.cwd(), 'src', 'uploads'));
  },
  filename(req, file, cb) {
    const unique = Date.now() + '-' + Math.random();
    cb(null, unique + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });
```

**< 라우터에서 사용 >**

```js
router.post('/profile', upload.single('avatar'), controller.uploadAvatar);
```

---

# 7. Multer를 사용할 때 자주 하는 실수

- 폴더(src/uploads) 미리 안 만들어둠 → ENOENT 에러
- req.file → single에서만 존재
- mimetype 검사 잊고 확장자만 검사함
- filename에서 확장자 누락함
- storage를 잘못된 경로로 지정함 (process.cwd() 사용 권장)
