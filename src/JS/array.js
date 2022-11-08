export const errorList = {
  accessDenied: '접근 권한이 없습니다.',
  tokenExpired: '토큰이 만료되었습니다.\n다시 로그인해 주세요.',
  tokenError: '비정상적인 요청이 감지되어 로그아웃 합니다.',
  serverError: '잠시 후 다시 시도해 주세요.',
  duplicateLogin: '중복 로그인 되었습니다.\n다시 로그인해 주세요.',
  refresh: '새로 고침 후 다시 시도해 주세요.',
  addDays: '날짜 입력 형식이 잘못되었습니다.\n다시 입력해 주세요.',
  dataPasses: '이벤트 쿠폰 발급 가능 기한이 초과되었습니다.\n다시 입력해 주세요.',
};

export const statusArr = {
  Pending: '결제대기',
  Issued: '발급완료',
  Active: '사용중',
  Applied: '적용 완료',
  Inactive: '만료',
  Refunded: '환불',
  Revoked: '취소',
};

export const serviceCodeToString = {
  100: '마크클라우드',
  110: '마크뷰'
}