import axios, { AxiosHeaders } from 'axios';
import { getCookie, setCookie, removeCookie } from './cookie';

const header = () => ({
  headers: {
    'Content-Type': 'application/json',
    'access-token': getCookie('myToken'),
  },
});

const fileHeader = () => ({
  headers: {
    'Content-Type': 'multipart/form-data',
    'access-token': getCookie('myToken'),
  },
});

//~ API Error Handling Function
const errorHandling = async error => {
  const { status } = error?.response;
  const { detail } = error?.response.data;
  const failCount = detail?.split(',')[1];
  switch (status) {
    case 401:
      if (detail === 'Access Denied') return 'accessDenied';
      else if (detail === 'Please Add Days') return 'addDays';
      break;
    case 403:
      if (detail === 'AccessTokenExpired') return await tokenReissue();
      else if (detail === 'LoginRequired') return 'tokenExpired';
      else if (detail === 'DuplicateLoginDetection') return 'duplicateLogin';
      else if (detail === 'Invaild User ID') return 'wrongId';
      else if (detail === `Invaild Password,${failCount}`)
        return `wrongPw,${failCount}`;
      else if (detail === 'Days Limit Exceeded') return 'datePasses';
      else if (detail === 'Expiration Date Exceeds limit')
        return 'exceedCharOfDate';
      else if (detail === 'Duplicated Id') return 'duplicateId';
      else if (detail === 'Retired User') return 'retired';
      break;
    case 499:
      return 'tokenError';
    case 500:
      return 'serverError';
    case 404:
      return 'notFound';
    case 501:
      if (detail === 'IntegrityError') return 'integrityError';
      break;
    case 504:
      return 'renderErrorPage';
    default:
      return;
  }
};

//~ 토큰 재발급
const tokenReissue = async () => {
  const headers = {
    'Content-Type': 'application/json',
    'access-token': getCookie('myToken'),
    'refresh-token': getCookie('rfToken'),
  };
  try {
    const result = await axios.get(`/api/users/self/token`, { headers });
    removeCookie('myToken');
    setCookie('myToken', result.data.data.access_token, {
      path: '/',
    });
    window.location.reload();
  } catch (error) {
    return await errorHandling(error);
  }
};

//~ LogIn
export const signIn = async (userId, userPw) => {
  const header = { 'Content-Type': 'application/json' };
  try {
    const ipSearch = await axios.get('https://api.ip.pe.kr/');
    const ip = ipSearch.data;
    return await axios.post(
      '/api/admin/login',
      { user_id: userId, password: userPw, login_ip: ip },
      { header }
    );
  } catch (error) {
    return await errorHandling(error);
  }
};

//~ Home
// 회원 Count
export const getUserCount = async target => {
  try {
    return await axios.get(`/api/admin/users/count?target=${target}`, header());
  } catch (error) {
    return await errorHandling(error);
  }
};

// 검색 Count
export const getSearchCount = async target => {
  try {
    return await axios.get(
      `/api/admin/search/count?target=${target}`,
      header()
    );
  } catch (error) {
    return await errorHandling(error);
  }
};

// 검색왕 순위
export const getSearchKing = async target => {
  try {
    return await axios.get(`/api/admin/search/king?target=${target}`, header());
  } catch (error) {
    return await errorHandling(error);
  }
};

//~ Manage
// 회원 정보 조회
export const getUserList = async (page, limit) => {
  try {
    return await axios.get(
      `/api/admin/users?page=${page}&limit=${limit}`,
      header()
    );
  } catch (error) {
    return await errorHandling(error);
  }
};

// 회원 정보 검색
export const searchUser = async (target, search_word, page, limit) => {
  try {
    return await axios.get(
      `/api/admin/users/search?target=${target}&search_word=${search_word}&page=${page}&limit=${limit}`,
      header()
    );
  } catch (error) {
    return await errorHandling(error);
  }
};

// 쿠폰 발급
export const applyToken = async data => {
  try {
    return await axios.post(`/api/admin/service/apply/token`, data, header());
  } catch (error) {
    return await errorHandling(error);
  }
};

//~ Inquiry
// 문의 내역 조회
export const getInquiryList = async (target, page, limit) => {
  const param = () => {
    if (target === 'all') return 'inquirys';
    else if (target === 'no-answer') return 'inquirys/no-answer';
  };
  try {
    return await axios.get(
      `api/admin/${param()}?page=${page}&limit=${limit}`,
      header()
    );
  } catch (error) {
    return await errorHandling(error);
  }
};

// 문의 내역 상세 페이지
export const getInquiryDetail = async id => {
  try {
    return await axios.get(`/api/admin/inquiry/${id}`, header());
  } catch (error) {
    return await errorHandling(error);
  }
};

// 답변 등록
export const answerPost = async (id, data) => {
  try {
    return await axios.post(`/api/admin/inquiry/answer/${id}`, data, header());
  } catch (error) {
    return await errorHandling(error);
  }
};

// 답변 수정
export const answerEdit = async (id, data) => {
  try {
    return await axios.post(
      `/api/admin/inquiry/answer-edit/${id}`,
      data,
      header()
    );
  } catch (error) {
    return await errorHandling(error);
  }
};

// 답변 삭제
export const answerDelete = async id => {
  try {
    return await axios.post(
      `/api/admin/inquiry/answer-delete/${id}`,
      {},
      header()
    );
  } catch (error) {
    return await errorHandling(error);
  }
};

//~ Notice
// 공지 사항 내역 불러오기
export const getNoticeList = async (page, limit) => {
  try {
    return await axios.get(
      `/api/admin/notification?page=${page}&limit=${limit}`,
      header()
    );
  } catch (error) {
    return await errorHandling(error);
  }
};

// 공지 사항 상세 페이지
export const getNoticeDetail = async id => {
  try {
    return await axios.get(`/api/admin/notification/${id}`, header());
  } catch (error) {
    return await errorHandling(error);
  }
};

//공지 사항 작성
export const noticeWrite = async data => {
  try {
    return await axios.post(`/api/admin/notification`, data, header());
  } catch (error) {
    return await errorHandling(error);
  }
};

// 공지 사항 수정
export const noticeEdit = async (id, data) => {
  try {
    return await axios.post(
      `/api/admin/notification/edit/${id}`,
      data,
      header()
    );
  } catch (error) {
    return await errorHandling(error);
  }
};

// 공지 사항 삭제
export const noticeDelete = async id => {
  try {
    return await axios.post(
      `/api/admin/notification/delete/${id}`,
      {},
      header()
    );
  } catch (error) {
    return await errorHandling(error);
  }
};

// 공지 사항 다중 삭제
export const noticeMultiDelete = async data => {
  try {
    return await axios.post(`/api/admin/notification/delete`, data, header());
  } catch (error) {
    return await errorHandling(error);
  }
};

//~ Event
// 쿠폰 발급 내역 조회
export const getCouponList = async (page, limit) => {
  try {
    return await axios.get(
      `/api/admin/service/view/token?page=${page}&limit=${limit}`,
      header()
    );
  } catch (error) {
    return await errorHandling(error);
  }
};

//~ USA Data Cache Management
// 캐시 불러오기
export const getCacheList = async () => {
  try {
    return await axios.get('/us/system/dump_cache?passcode=kingsan', header());
  } catch (error) {
    return await errorHandling(error);
  }
};

// 캐시 사이즈 조회
export const getCacheSize = async () => {
  try {
    return await axios.get(
      '/us/system/get_cache_size?passcode=kingsan',
      header()
    );
  } catch (error) {
    return await errorHandling(error);
  }
};

// 캐시 지우기
export const removeCache = async () => {
  try {
    return await axios.get('/us/system/clear_cache?passcode=kingsan', header());
  } catch (error) {
    return await errorHandling(error);
  }
};

// 캐시 JSON 지우기
export const removeCacheJson = async () => {
  try {
    return await axios.get(
      '/us/system/manual_removal_json?passcode=kingsan',
      header()
    );
  } catch (error) {
    return await errorHandling(error);
  }
};

//~ 서비스 관리
// 서비스 목록 불러오기
export const getServices = async () => {
  try {
    return await axios.get(`/api/admin/service`, header());
  } catch (error) {
    return await errorHandling(error);
  }
};

// 서비스 생성
export const createService = async data => {
  try {
    return await axios.post('/api/admin/service', data, header());
  } catch (error) {
    return await errorHandling(error);
  }
};

// 서비스 수정
export const editService = async (code, data) => {
  try {
    return await axios.post(`/api/admin/service/edit/${code}`, data, header());
  } catch (error) {
    return await errorHandling(error);
  }
};

//서비스 삭제
export const deleteService = async code => {
  try {
    return await axios.post(`/api/admin/service/delete/${code}`, {}, header());
  } catch (error) {
    return await errorHandling(error);
  }
};

//~ 상품 관리
// 상품 불러오기
export const getMerchant = async () => {
  try {
    return await axios.get(`/api/admin/merchants`, header());
  } catch (error) {
    return await errorHandling(error);
  }
};

// 상품 등록
export const applyMerchant = async data => {
  try {
    return await axios.post(`/api/admin/merchants`, data, header());
  } catch (error) {
    return await errorHandling(error);
  }
};

// 상품 수정
export const editMerchant = async (id, data) => {
  try {
    return await axios.post(`/api/admin/merchants/edit/${id}`, data, header());
  } catch (error) {
    return await errorHandling(error);
  }
};

// 상품 다중 삭제
export const productMultiDelete = async arr => {
  try {
    return await axios.post(`/api/admin/merchants/delete`, arr, header());
  } catch (error) {
    return await errorHandling(error);
  }
};

// 상품 삭제
export const deleteMerchant = async id => {
  try {
    return await axios.post(`/api/admin/merchants/delete/${id}`, {}, header());
  } catch (error) {
    return await errorHandling(error);
  }
};

//~ 관리자 관리
// 아이디 중복체크
export const idDuplicateCheck = async id => {
  try {
    return await axios.post(`/api/admin/check/id-duplicate`, { user_id: id });
  } catch (error) {
    return await errorHandling(error);
  }
};

// 관리자 목록 불러오기
export const getAdmin = async ({ page, limit }, filter, searchInput) => {
  try {
    return await axios.get(
      `/api/admin/accounts?page=${page}&limit=${limit}${
        filter === 'all'
          ? ''
          : `&filter_type=${filter}&filter_val=${searchInput}`
      }`,
      header()
    );
  } catch (error) {
    return await errorHandling(error);
  }
};

// 관리자 추가
export const addAdmin = async data => {
  try {
    return await axios.post(`/api/admin/accounts`, data, header());
  } catch (error) {
    return await errorHandling(error);
  }
};

// 관리자 다중 삭제
export const adminMultiDelete = async pkArr => {
  try {
    const query = {
      items: pkArr,
    };
    return await axios.post(`/api/admin/accounts/delete`, query, header());
  } catch (error) {
    return await errorHandling(error);
  }
};

// 관리자 삭제
export const adminDelete = async pk => {
  try {
    return await axios.post(`/api/admin/accounts/delete/${pk}`, {}, header());
  } catch (error) {
    return await errorHandling(error);
  }
};

// 관리자 수정
export const adminEdit = async ({
  pk,
  password,
  admin_role,
  birthday,
  phone,
  email,
}) => {
  try {
    const query = {
      password: password === 'samplePw' ? null : password,
      admin_role: admin_role,
      birthday: birthday,
      phone: phone.replaceAll('-', ''),
      email: email,
    };
    return await axios.post(`/api/admin/accounts/edit/${pk}`, query, header());
  } catch (error) {
    return await errorHandling(error);
  }
};

//~ 팝업 관리
// 팝업 불러오기
export const getPopUpList = async (due, { page, limit }) => {
  try {
    return await axios.get(
      `/api/admin/popup?filter_type=${due}&page=${page}&limit=${limit}`,
      header()
    );
  } catch (error) {
    return await errorHandling(error);
  }
};

// 팝업 등록
export const createPopup = async ({ service_code, start, end, img, link }) => {
  try {
    return await axios.post(
      `/api/admin/popup?service_code=${service_code}&start_date=${start}&end_date=${end}${
        link.trim() === '' ? '' : `&link_url=${link}`
      }`,
      { file: img },
      fileHeader()
    );
  } catch (error) {
    return await errorHandling(error);
  }
};

// 팝업 수정
export const editPopup = async ({
  id,
  service_code,
  start,
  end,
  img,
  link,
}) => {
  try {
    return await axios.post(
      `/api/admin/popup/edit/${id}?service_code=${service_code}&start_date=${start}&end_date=${end}${
        link.trim() === '' ? '' : `&link_url=${link}`
      }`,
      typeof img === 'string' ? {} : { file: img },
      typeof img === 'string' ? header() : fileHeader()
    );
  } catch (error) {
    return await errorHandling(error);
  }
};

// 팝업 삭제
export const deletePopup = async id => {
  try {
    return await axios.post(`/api/admin/popup/delete/${id}`, {}, header());
  } catch (error) {
    return await errorHandling(error);
  }
};
