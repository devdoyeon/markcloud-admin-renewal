import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaWindowClose } from 'react-icons/fa';
import CommonModal from 'Components/CommonModal';
import { getMerchant, applyNewCoupon } from 'JS/API';
import { commonModalSetting, catchError } from 'JS/common';

const NewCouponModal = ({ setModal }) => {
  const [merchantList, setMerchantList] = useState([]);
  const [couponInfo, setCouponInfo] = useState({
    days: '',
    issueCnt: '',
  });
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const navigate = useNavigate();

  let prevent = false;

  //= 상품 목록 불러오기
  const getMerchantList = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 100);
    const result = await getMerchant();
    if (typeof result === 'object') {
      setMerchantList(result?.data?.data);
    }
  };

  const renderMerchantList = () => {
    return merchantList?.map(({ service_code, merchant_name }) => {
      return <option value={service_code}>{merchant_name}</option>;
    }, <></>);
  };

  const numInput = (e, col) => {
    setCouponInfo(prev => {
      const clone = { ...prev };
      clone[col] = e.target.value
        .replace(/[^0-9.]/g, '')
        .replace(/(\..*)\./g, '$1');
      return clone;
    });
  };

  const applyCoupon = async () => {
    const query = { ...couponInfo };
    if (query.days === '') query.days = 30;
    if (query.issueCnt === '') query.issueCnt = 1;
    else {
      query.days = Number(query.days);
      query.issueCnt = Number(query.issueCnt);
    }
    const result = await applyNewCoupon(query);
    if (typeof result === 'object') {
      setAlert('completeApply');
      commonModalSetting(setAlertBox, true, 'alert', '쿠폰이 발급되었습니다.');
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  useEffect(() => {
    getMerchantList();
  }, []);

  return (
    <>
      <div className='modal-background'>
        <div className='modal new-coupon'>
          <div className='topBar'>
            <h2>쿠폰 발급하기</h2>
            <div onClick={() => setModal(false)}>
              <FaWindowClose />
            </div>
          </div>
          <div className='column'>
            <div className='row'>
              <span>상품명</span>
              <select>{renderMerchantList()}</select>
            </div>
            <div className='row'>
              <span>쿠폰 유효기간</span>
              <input
                type='text'
                maxLength={3}
                placeholder='999일까지 입력 가능합니다.'
                value={couponInfo.days}
                onChange={e => numInput(e, 'days')}
              />
            </div>
            <div className='row'>
              <span>쿠폰 발급 개수</span>
              <input
                type='text'
                maxLength={4}
                placeholder='9999개까지 입력 가능합니다.'
                value={couponInfo.issueCnt}
                onChange={e => numInput(e, 'issueCnt')}
              />
            </div>
            <p>
              *쿠폰 유효기간과 발급 개수 미입력 시<br />
              유효기간 30일 쿠폰 한 개가 자동 발급됩니다.
            </p>
          </div>
          <div className='footer row'>
            <button onClick={applyCoupon}>발급</button>
            <button>취소</button>
          </div>
        </div>
      </div>
      {alertBox.bool && (
        <CommonModal
          setModal={setAlertBox}
          modal={alertBox}
          okFn={() => {
            if (alert === 'logout') navigate('/');
            else if (alert === 'completeApply') setModal(false);
            else return;
          }}
        />
      )}
    </>
  );
};

export default NewCouponModal;
