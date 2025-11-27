// TODO) Env Loader: 환경 설정 공용 로더
// ?) 모든 모듈에서 .env를 확실하게 읽도록 공용 로더 제공
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * &) __filename & __dirname
 * ESM(import/export) 환경에서는 기존에 쓰던 __filename과 __dirname이 자동으로 없다.
 * 그래서 이 함수로 ‘지금 이 파일이 어디 있는지’를 직접 계산해야 한다.
 *
 * &) fileURLToPath(import.meta.url)
 * “현재 실행 중인 파일의 실제 경로를 문자열로 바꿔주는 도구”
 * import.meta.url → 파일의 URL 형태 경로 (예: file:///Users/.../env.js)
 * fileURLToPath() → 그 URL을 일반 경로 문자열로 변환
 * 그걸 기반으로 __dirname까지 다시 만들어 쓰는 것
 *
 * &) path.dirname(경로)
 * “이 경로가 들어 있는 부모 폴더의 경로만 뽑아줘.”
 * @example
 * path.dirname('/user/project/src/config/env.js')
 * → /user/project/src/config
 */

// *) 프로젝트 루트의 .env를 절대 경로로 로드
dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});

/**
 * &) path: path.resolve(__dirname, '../../.env')
 * __dirname → 지금 이 env.js 파일이 들어 있는 폴더
 * '../../.env' → 거기에서 두 단계 위로 올라가서 .env 파일을 찾는다
 * path.resolve() → 상대경로를 절대경로로 바꿔준다
 */

// ! 인증 방식에 따라 설정이 달라지니 아래 추가

/**
 * -------------------------------
 * [Env Loader: 역할과 필요성]
 * -------------------------------
 *
 * &) 목적
 * .env 파일에는 DB 비밀번호 같은 중요한 값들이 들어있다.
 * 하지만 Node.js는 기본적으로 .env를 자동으로 읽지 않는다.
 * 그래서 “모든 파일이 공통으로 사용할 수 있도록”
 * 단 한 곳에서 .env를 확실하게 읽어주는 전담 로더가 필요하다.
 * 이 로더가 실행되면 어떤 파일에서든
 * process.env.DB_PASSWORD 같은 값을 바로 사용할 수 있게 된다.
 *
 * &) 문제 상황의 원인
 * dotenv.config()는 호출 위치·순서·경로에 따라 동작이 달라진다.
 * 그래서 제대로 로딩되지 않으면 DB 접속 실패 같은 심각한 버그가 실제로 난다.
 *
 * -------------------------------
 * [실무에서 자주 발생하는 오류 케이스]
 * -------------------------------
 *
 * 1) 여러 파일에서 중구난방으로 dotenv.config() 호출
 *    - app.js에서 호출
 *    - server.js에서도 호출
 *    - 어떤 모듈은 아예 호출 안 함
 *    → 파일마다 process.env 값이 다르게 잡혀 DB 연결이 실패함
 *
 * 2) 상대 경로로 dotenv.config()를 호출하는 경우
 *    - 실행 위치가 바뀌면 경로가 깨진다
 *    → .env 로드를 실패해도 조용히 넘어가서 원인 파악이 어렵다
 *
 * 3) ESM(import/export) 환경 문제
 *    - __dirname이 기본 제공되지 않아 경로 계산 실패
 *    → .env 파일을 찾지 못해 환경 변수 전체가 비어 있음
 *
 * 4) 테스트 환경(Jest 등)
 *    - 테스트 실행 경로가 개발 환경과 달라서
 *      dotenv가 자동으로 적용되지 않는다
 *    → 테스트에서만 DB 접속 실패가 발생
 *
 * 5) PM2/Docker/배포 환경
 *    - 로컬에서는 잘 되는데 배포 환경에서 process.env 값이 비어 있음
 *    → 실행 위치·파일 구조가 다르기 때문
 *
 * -------------------------------
 * [공용 env 로더가 필요한 이유]
 * -------------------------------
 * - dotenv.config는 “여기서만 한 번 호출한다”고 규칙화
 * - 경로를 절대 경로로 고정해 어떤 환경에서도 안정적으로 로드
 * - 모든 모듈이 이 파일만 import하면 환경이 자동 초기화됨
 *
 * 결국 환경 변수 로딩을 단 한 곳에서 완전히 통제해
 * 경로 문제, 호출 순서 문제, 실행 위치 문제 같은
 * 자잘하지만 치명적인 버그를 모두 예방하는 전략이다.
 */
