import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaWindowClose } from 'react-icons/fa';
import CommonModal from './CommonModal';
import { catchError, commonModalSetting, enterFn, outClick } from 'JS/common';
import { applyToken } from 'JS/API';

const AssignCouponModal = ({ setCouponModal, pk }) => {
  const [days, setDays] = useState('');
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const navigate = useNavigate();

  //= 쿠폰 발급
  const couponIssue = async () => {
    let data = {};
    if (!days) data = { user_pk: pk };
    else {
      if (days < 1 || days > 30)
        return commonModalSetting(
          setAlertBox,
          true,
          'alert',
          '이벤트 기간은<br/>최소 1일에서 최대 30일입니다.'
        );
      data = { user_pk: pk, days: days };
    }
    const result = await applyToken(data);
    if (typeof result === 'object') {
      setAlert('completeApply');
      commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '쿠폰 발급이 완료되었습니다.'
      );
      setCouponModal(false);
      setDays('');
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  useEffect(() => {
    window.addEventListener('click', e => outClick(e, setCouponModal));
  });

  return (
    <>
      <div className='modal-background'>
        <div className='modal coupon'>
          <div className='topBar'>
            <h2>쿠폰 발급</h2>
            <div onClick={() => setCouponModal(false)}>
              <FaWindowClose />
            </div>
          </div>
          <hr />
          <div className='wrap'>
            <input
              type='text'
              placeholder='쿠폰을 적용할 일수를 입력해 주세요.'
              value={days}
              onChange={e => setDays(e.target.value)}
              onKeyDown={e => enterFn(e, couponIssue)}
              maxLength={2}
            />
            <p>미입력 시 30일로 발급됩니다.</p>
            <div className='footer'>
              <div>
                <button onClick={couponIssue}>발급</button>
                <button onClick={() => setCouponModal(false)}>취소</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {alertBox.bool && (
        <CommonModal
          setCouponModal={setAlertBox}
          modal={alertBox}
          okFn={() => {
            if (alert === 'completeApply') setCouponModal(false);
            else if (alert === 'logout') navigate('/');
            else return;
          }}
        />
      )}
    </>
  );
};

export default AssignCouponModal;
