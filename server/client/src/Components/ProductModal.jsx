import { useState, useEffect } from 'react';
import { changeState } from 'JS/common';

const ProductModal = ({ setModal, mode, productInfo }) => {
  const [info, setInfo] = useState({
    service_code: 100,
    merchant_code: '',
    merchant_name: '',
    merchant_price: '',
  });

  useEffect(() => {
    if (mode === 'edit') setInfo({ ...productInfo });
  }, [mode]);

  return (
    <div className='modal-background'>
      <div className='modal product'>
        <h2>{mode === 'apply' ? '신규 상품 등록' : '상품 수정'}</h2>
        <div className='column productInput'>
          <div className='row'>
            <span>서비스 코드</span>
            <select
              value={info.service_code}
              onChange={e =>
                changeState(setInfo, 'service_code', e.target.value)
              }>
              <option value={100}>마크클라우드</option>
              <option value={110}>마크뷰</option>
              <option value={120}>마크그룹웨어</option>
              <option value={130}>마크링크</option>
            </select>
          </div>
          <div className='row'>
            <span>상품 코드</span>
            <input
              type='text'
              value={info.product_code}
              placeholder='상품 코드를 입력해 주세요.'
              onChange={e =>
                changeState(setInfo, 'merchant_code', e.target.value)
              }
            />
          </div>
          <div className='row'>
            <span>상품명</span>
            <input
              type='text'
              value={info.product_name}
              placeholder='상품명을 입력해 주세요.'
              onChange={e =>
                changeState(setInfo, 'merchant_name', e.target.value)
              }
            />
          </div>
          <div className='row'>
            <span>상품 가격</span>
            <input
              type='text'
              value={Number(info.price.replaceAll(',', '')).toLocaleString()}
              placeholder='상품 가격을 입력해 주세요.'
              onChange={e =>
                changeState(setInfo, 'merchant_price', e.target.value)
              }
            />
          </div>
        </div>
        <div className='btn-wrap row'>
          <button>{mode === 'apply' ? '등록' : '수정'}</button>
          <button onClick={() => setModal(false)}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
