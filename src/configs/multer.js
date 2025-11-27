// TODO) Multer-Loader: 환경, 설정, 공통 미들웨어 정의
// ?) 이미지 업로드 설정
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

// ?) 파일 크기 제한
const limits = { fileSize: 5 * 1024 * 1024 }; // 5MB
// ^) 파일 사이즈는 상수로 빼둬야 정책바뀜, 테스트 때 접근성이 좋다!

// ?) 업로드 폴더 생성 (없으면 자동 생성)
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

/**
 * &) const uploadDir = path.join(process.cwd(), 'public', 'uploads');
 * “현재 프로젝트가 실행되는 위치(process.cwd()) 기준으로 public/uploads 폴더 경로를 만들어라.”
 * process.cwd() → Node.js가 지금 실행된 프로젝트 루트 폴더
 * 결과: /Users/leon/project/public/uploads
 *
 * &) fs.mkdirSync(uploadDir, { recursive: true });
 * 폴더가 없으면 자동으로 만들어주는 코드
 * mkdirSync → 폴더를 만드는 Node의 기본 메서드
 * { recursive: true } → 상위 폴더가 없어도 연속해서 쫙 만들어라
 * 예를 들어 public/도 없고 uploads/도 없어도 둘 다 생성됨
 */

// ?) 파일 저장 방식 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const validExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)
      ? ext
      : '';
    cb(null, crypto.randomUUID() + validExt);
  },
});

// ?) 허용 MIME 타입 필터링
const fileFilter = (req, file, cb) => {
  const isValidType = ['image/jpeg', 'image/png'].includes(file.mimetype);
  cb(
    isValidType ? null : new Error('jpeg/png만 업로드 가능합니다.'),
    isValidType
  );
};

/**
 * &) multer.diskStorage()
 * “이 파일을 어디에 저장할까?”, “이름은 어떻게 지을까?”
 * 이 두 가지를 결정하는 설정 객체를 만든다.
 *
 * 1. destination: 업로드 될 폴더를 결정
 * “이 파일을 어느 폴더에 저장할까?”
 * cb(null, uploadDir) → 에러 없이(uploadDir) 폴더에 저장
 *
 * 2. filename: 저장될 파일 이름을 결정하는 로직
 * 2-1. 확장자 추출
 * 업로드된 원본 파일명에서 .jpg, .png 같은 확장자만 뽑아냄
 * .toLowerCase()로 대문자(JPG)도 통일
 * 2-2. 확장자 검증
 * 허용된 확장자 목록에 있는지 체크한다.
 * 허용됨 → 그 확장자를 그대로 사용
 * 허용 안 됨 → 확장자를 빈 문자열로 만들어버림('')
 * 즉, Multer 단에서도 1차 보안 처리를 해주는 셈.
 * 2-3. 파일 이름을 랜덤 UUID로 생성
 * crypto.randomUUID()로 완전 랜덤 이름을 만들고 검증된 확장자만 붙이는 방식이 가장 안전
 *
 * &) fileFilter
 * 업로드가 storage로 넘어가기 전에 MIME 타입을 검사해서 올바른 이미지인지 확인하는 단계
 * 여기서 걸리면, 아예 저장도 안 되고 multer 단계에서 바로 요청이 막힌다.
 *
 * ?) MIME 타입이란?
 * 브라우저나 OS가 보내주는 “이 파일은 어떤 종류야”라는 정보다.
 * image/jpeg
 * image/png
 * image/webp
 * application/pdf
 * text/html
 *
 * 확장자보다 더 신뢰할 수 있는 값이기 때문에,
 * 보안에서는 MIME 타입 필터링이 확장자보다 더 중요하게 취급된다.
 *
 * &) const isValidType = ['image/jpeg', 'image/png'].includes(file.mimetype);
 * 업로드된 파일의 MIME 타입이 jpeg 또는 png인지 확인
 * 포함되어 있으면 true, 아니면 false
 *
 * & cb(null or Error, boolean)
 * 이미지면: cb(null, true)
 * 이미지 아니면: cb(new Error(...), false)
 * 이미지가 아니라면 multer가 즉시 업로드를 중단하고 에러를 응답함.
 */

// ?) 최종 업로드 인스턴스
export const upload = multer({
  storage,
  limits,
  fileFilter,
});

/**
 * -------------------------------
 * [Multer Loader: 역할과 필요성]
 * -------------------------------
 *
 * &) 목적
 * 이미지 업로드는 다양한 라우터(user, product, contract 등)에서 공통으로 사용된다.
 * 그런데 업로드 용량, 저장 위치, 파일명 규칙, 허용 확장자 같은 설정이
 * 라우터마다 흩어져 있으면 유지보수가 매우 어렵다.
 * 그래서 업로드 설정을 단 한 곳(config)에서 통일해 관리하기 위한 공용 로더이다.
 *
 * &) 문제 상황의 원인
 * 이미지 업로드는 “파일 시스템 접근 + 파일 검증”이 섞여 있어서
 * 설정이 조금만 어긋나도 오류가 자주 발생한다.
 * 경로 문제, 확장자 문제, MIME 타입 문제, 용량 초과 등
 * 라우터마다 따로 설정해두면 재현도 어렵고 디버깅도 혼란스럽다.
 *
 * -------------------------------
 * [실무에서 실제로 자주 터지는 문제들]
 * -------------------------------
 *
 * 1) 업로드 경로가 라우터마다 다름
 *    → 어느 곳은 uploads/, 어느 곳은 images/
 *    → 배포 환경에서 경로 충돌로 이미지가 아예 안 뜨는 문제 발생
 *
 * 2) 파일 사이즈 제한 미설정 또는 제각각인 경우
 *    → 특정 라우터에서는 10MB 허용, 어떤 라우터는 1MB로 막혀있음
 *    → “왜 어떤 페이지에서는 업로드 되는데 다른 페이지는 안 되지?” 같은 혼란
 *
 * 3) 파일명 충돌
 *    → 날짜 기반, randomUUID 기반 등 규칙이 뒤섞이면
 *      동일 파일 덮어쓰기나 예상치 못한 이름이 생김
 *
 * 4) MIME 타입 검증 누락
 *    → 프론트에서 jpg처럼 보이지만 실제로는 exe 파일 위장 업로드가 들어오는 케이스
 *      실무에서도 보기보다 위험한 보안 취약점이다
 *
 * 5) 업로드 폴더 자동 생성 누락
 *    → 개발 환경에서는 이미 폴더가 존재해서 문제 없지만
 *      새로 클론한 팀원 환경이나 배포 서버는 폴더가 없어서 실행 즉시 오류 발생
 *
 * -------------------------------
 * [왜 공용 Multer 설정이 필요한가?]
 * -------------------------------
 * - 업로드 정책(용량·확장자·경로)을 프로젝트 전체에서 일원화 가능
 * - 라우터는 “정책을 호출하기만 하면 되는 구조”로 단순화
 * - 보안 검증(MIME Filter)도 한 곳에서 통제하므로 실수 감소
 * - 팀원 간 코드 스타일 차이로 생기는 업로드 버그를 예방
 *
 * 결국 업로드처럼 민감한 로직은 config에서 단일 책임으로 관리해야
 * 실무에서도 버그를 줄이고, 서비스 전체 안정성을 유지할 수 있다.
 */
