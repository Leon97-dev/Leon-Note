# Sharp — 고성능 이미지 처리 라이브러리

_참고 사이트_
https://sharp.pixelplumbing.com/

---

# 1. 개요

Sharp는 Node.js에서 이미지 리사이즈, 변환, 압축을 고속으로 처리해주는 네이티브 기반 이미지 처리 라이브러리다.
Express와 multer 업로드 후 이미지 후처리 용도로 실무에서 널리 사용된다.

npm i sharp ✅ 설치 필요

---

# 2. 주요 역할

- 이미지 크기 조정(resize)
- JPG/PNG/WebP 포맷 변환
- 이미지 압축(품질 조절)
- 썸네일 생성
- 파일 버퍼 처리
- S3 업로드 전 이미지 최적화

이미지를 서버에 저장하거나 S3로 보내기 전에 용량 최적화하는 데 매우 효과적이다.

---

# 3. 기본 사용법

**< 이미지 리사이즈 >**

```js
import sharp from 'sharp';

await sharp('input.png').resize(300, 300).toFile('output.png');
```

---

# 4. 파일 버퍼로 처리 (multer와 함께 쓰는 가장 일반적인 패턴)

multer의 메모리 저장 방식(memoryStorage)와 조합

```js
const resized = await sharp(req.file.buffer)
  .resize(500)
  .jpeg({ quality: 80 })
  .toBuffer();
```

→ 이후 S3에 업로드 가능
→ prisma DB에 파일명 저장 가능

---

# 5. 이미지 포맷 변환

```js
await sharp('input.png').toFormat('webp').toFile('output.webp');
```

---

# 6. 이미지 압축 (품질 조절)

```js
await sharp('input.jpg').jpeg({ quality: 70 }).toFile('compressed.jpg');
```

---

# 7. 썸네일 생성 예시

```js
await sharp('profile.png').resize(100, 100).toFile('profile-thumb.png');
```

---

# 8. 메타데이터 제거 (보안/용량 최적화)

```js
await sharp(req.file.buffer).resize(400).withMetadata(false).toBuffer();
```

---

# 9. 실무에서 많이 쓰는 조합

**< 이미지 업로드 + 썸네일 생성 + WebP 변환 >**

```js
const original = await sharp(req.file.buffer)
  .resize(1200)
  .webp({ quality: 80 })
  .toBuffer();

const thumbnail = await sharp(req.file.buffer)
  .resize(300)
  .webp({ quality: 70 })
  .toBuffer();
```

**< S3 업로드 전에 용량 최적화 >**
모바일 환경/블로그 이미지에서 특히 중요하다.

---

# 10. 주의할 점

- 서버 CPU 리소스를 많이 사용할 수 있음
- 대규모 이미지 처리 → 워커(Worker Thread)로 옮기는 게 좋음
- GIF 처리 일부 제한 있음
- Windows 개발 환경에서 설치 시 바이너리 의존성 때문에 문제 생기기도 함

---

# 11. Sharp와 Multer 조합 구조 예시

```js
router.post('/upload', upload.single('image'), async (req, res) => {
  const optimized = await sharp(req.file.buffer)
    .resize(800)
    .webp({ quality: 80 })
    .toBuffer();

  // optimized 파일을 저장 or S3 업로드
});
```
