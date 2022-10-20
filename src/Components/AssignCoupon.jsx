import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaWindowClose } from 'react-icons/fa';
import { applyToken } from 'JS/API';
import { catchError } from 'JS/common';

const AssignCoupon = ({ setModal, pk }) => {
  const [days, setDays] = useState('');
  const navigate = useNavigate();

  const outClick = e => {
    if (e.target.className === 'modal-background') {
      setModal(false);
      window.removeEventListener('click', outClick);
    }
  };

  const couponIssue = async () => {
    let data = {};
    if (!days) {
      data = { user_pk: pk };
    } else {
      if (days < 1 || days > 30)
        return alert('이벤트 기간은 최소 1일에서 최대 30일입니다.');
      data = { user_pk: pk, days: days };
    }
    const result = await applyToken(data);
    if (typeof result === 'object') {
      alert('쿠폰이 발급 되었습니다.');
      setModal(false);
      setDays('');
    } else return catchError(result, navigate);
  };

  useEffect(() => {
    window.addEventListener('click', e => outClick(e));
  });

  return (
    <div className='modal-background'>
      <div className='modal coupon'>
        <div className='topBar'>
          <h2>쿠폰 발급</h2>
          <div onClick={() => setModal(false)}>
            <FaWindowClose />
          </div>
        </div>
        <hr />
        <div className='wrap'>
          <input
            type='text'
            placeholder='쿠폰을 적용할 일수를 입력해 주세요.'
          />
          <p>미입력 시 30일로 발급 됩니다.</p>
          <div className='footer'>
            <div>
              <button onClick={() => couponIssue()}>발급</button>
              <button onClick={() => setModal(false)}>취소</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignCoupon;
