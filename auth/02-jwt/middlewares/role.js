// TODO) Role: 요청마다 실행되는 커스텀 로직
// ?) 역할 검사 미들웨어
export function requireRole(...roles) {
  return (req, res, next) => {
    const role = req.user?.role;
    // ?) 역할 예외 처리
    if (!role || !roles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: '해당 역할의 권한이 없습니다',
      });
    }

    next();
  };
}
