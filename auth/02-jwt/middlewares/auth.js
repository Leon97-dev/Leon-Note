// TODO) Auth: 요청마다 실행되는 커스텀 로직
// ?) AccessToken을 해석(verify) 하고, 그 결과를 req.user에 주입하는 작업
import { verifyAccessToken } from '../services/auth-service.js';

// ?) 헤더 검사 함수
export function requireAuth(req, res, next) {
  // ?) 헤더 방어 처리
  const auth = req.headers.authorization || '';
  // ?) 헤더 구조 분해
  const [type, token] = auth.split(' ');
  // ?) 헤더 예외 처리
  if (type !== 'Bearer' || !token) {
    return res.status(401).json({
      success: false,
      message: '승인 헤더가 없거나 형식이 잘못되었습니다',
    });
  }

  try {
    const decoded = verifyAccessToken(token);
    // ?) 인증 미들웨어에 role 주입
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: '유효하지 않거나 만료된 토큰입니다',
    });
  }
}

/**
 * &) const auth = req.headers.authorization || '';
 * HTTP 요청에는 여러 헤더(header)가 함께 들어오는데,
 * *) 그중 인증용 헤더가 Authorization: Bearer <토큰>
 * 그래서 Express에서는 이걸 이렇게 꺼낼 수 있다.
 * req.headers.authorization이 없으면 undefined라서,
 * .split(' ')에서 오류가 나기 때문에 || '' 붙여서 방어 로직을 쓴 것이다.
 *
 * &) const [type, token] = auth.split(' ');
 * *) Authorization 헤더는 공백 기준으로 두 부분이다.
 * "Bearer abc123" 이런 식이라 가져오기 위해서는,
 * split(' ')을 써서 ['Bearer', 'abc123'] 구조분해 한 것이다.
 *
 * &) req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
 * *) 이건 Express 미들웨어의 핵심 테크닉이다.
 * req 객체는 한 요청(Request) 동안 유지되는 객체니까,
 * 여기에 user 프로퍼티를 추가해서 “검증된 사용자 정보”를 다음 단계로 넘기는 것이다.
 * 즉, 이후 실행될 컨트롤러나 라우터 핸들러는 req.user를 통해 인증된 사용자 정보를 바로 쓸 수 있다.
 *
 * &) 핵심 요약
 * 1. HTTP 요청 헤더의 Authorization: Bearer <token> 값을 검사
 * 2. 토큰이 없거나 형식이 틀리면 401
 * 3. 유효한 토큰이면 verifyAccessToken()으로 검증 → req.user에 정보 저장
 * 4. 이후 컨트롤러에서 req.user.id, req.user.email로 접근 가능
 */
