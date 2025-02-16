export const errorList = {
  accessDenied: '접근 권한이 없습니다.',
  tokenExpired: '토큰이 만료되었습니다.\n다시 로그인해 주세요.',
  retired: '탈퇴된 아이디입니다.',
  tokenError: '비정상적인 요청이 감지되어 로그아웃 합니다.',
  serverError: '잠시 후 다시 시도해 주세요.',
  duplicateLogin: '중복 로그인 되었습니다.\n다시 로그인해 주세요.',
  refresh: '새로 고침 후 다시 시도해 주세요.',
  addDays: '날짜 입력 형식이 잘못되었습니다.<br/>다시 입력해 주세요.',
  dataPasses:
    '이벤트 쿠폰 발급 가능 기한이 초과되었습니다.<br/>다시 입력해 주세요.',
  integrityError:
    '상품 등록이 되어 있는 서비스입니다.<br/>해당 서비스를 삭제하시려면 상품을 먼저 삭제해 주세요.',
  keywordTooLong: '해시태그가 너무 길거나 많습니다.',
};

export const statusArr = {
  Pending: '결제대기',
  Issued: '발급 완료',
  Active: '사용중',
  Applied: '적용 완료',
  Inactive: '만료',
  Refunded: '환불',
  Revoked: '취소',
};
