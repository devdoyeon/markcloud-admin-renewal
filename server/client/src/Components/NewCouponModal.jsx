import { useState, useEffect } from 'react';
import { FaWindowClose } from 'react-icons/fa';
import { getMerchant } from 'JS/API';

const NewCouponModal = ({ setModal }) => {
  const [merchantList, setMerchantList] = useState([]);
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

  const numInput = e => {
    e.target.value = e.target.value
      .replace(/[^0-9.]/g, '')
      .replace(/(\..*)\./g, '$1');
  };

  useEffect(() => {
    getMerchantList();
  }, []);

  return (
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
            <input type='text' maxLength={3} onChange={numInput} />
          </div>
          <div className='row'>
            <span>쿠폰 발급 개수</span>
            <input type='text' maxLength={4} onChange={numInput} />
          </div>
        </div>
        <div className='footer row'>
          <button>발급</button>
          <button>취소</button>
        </div>
      </div>
    </div>
  );
};

export default NewCouponModal;
