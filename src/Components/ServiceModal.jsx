import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CommonModal from './CommonModal';
import {
  changeState,
  commonModalSetting,
  enterFn,
  catchError,
  outClick,
} from 'JS/common';
import { createService, editService, deleteService } from 'JS/API';

const ServiceModal = ({ mode, setModal, info, setInfo }) => {
  const [origin, setOrigin] = useState('');
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const navigate = useNavigate();

  //= 서비스 등록
  const newService = async () => {
    if (info?.service_code.trim() === '')
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '서비스 코드를 입력해 주세요.'
      );
    else if (info?.service_name.trim() === '')
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '서비스명을 입력해 주세요.'
      );
    else {
      const result = await createService(info);
      if (typeof result === 'object') {
        setInfo({
          service_code: '',
          service_name: '',
        });
        setModal(false);
      } else return catchError(result, navigate, setAlertBox, setAlert);
    }
  };

  //= 서비스 수정
  const modifyService = async () => {
    const result = await editService(origin, info);
    if (typeof result === 'object') {
      setInfo({
        service_code: '',
        service_name: '',
      });
      setModal(false);
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  //= 서비스 삭제
  const removeService = async () => {
    const result = await deleteService(info.service_code);
    if (typeof result === 'object') {
      setInfo({
        service_code: '',
        service_name: '',
      });
      setModal(false);
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  useEffect(() => {
    if (mode === 'edit') setOrigin(info.service_code);
    else return;
  }, [mode]);

  useEffect(() => {
    window.addEventListener('click', e => outClick(e, setModal));
  }, []);

  return (
    <>
      <div className='modal-background'>
        <div className='modal service'>
          <h2>{mode === 'apply' ? '신규 서비스 등록' : '서비스 수정'}</h2>
          <div className='serviceInput column'>
            <div className='row'>
              <span>서비스 코드</span>
              <input
                type='text'
                placeholder='서비스 코드를 입력해 주세요.'
                value={info?.service_code}
                onChange={e =>
                  changeState(setInfo, 'service_code', e.target.value)
                }
                onKeyDown={e =>
                  enterFn(e, mode === 'apply' ? newService : modifyService)
                }
              />
            </div>
            <div className='row'>
              <span>서비스명</span>
              <input
                type='text'
                placeholder='서비스명을 입력해 주세요.'
                value={info?.service_name}
                onChange={e =>
                  changeState(setInfo, 'service_name', e.target.value)
                }
                onKeyDown={e =>
                  enterFn(e, mode === 'apply' ? newService : modifyService)
                }
              />
            </div>
          </div>
          <div className='btn-wrap row'>
            {mode === 'apply' || <button onClick={modifyService}>수정</button>}
            <button onClick={mode === 'apply' ? newService : removeService}>
              {mode === 'apply' ? '등록' : '삭제'}
            </button>
            <button
              onClick={() => {
                setModal(false);
                setInfo({
                  service_code: '',
                  service_name: '',
                });
              }}>
              닫기
            </button>
          </div>
        </div>
      </div>
      {alertBox.bool && (
        <CommonModal
          setModal={setAlertBox}
          modal={alertBox}
          okFn={() => {
            if (alert === 'logout') navigate('/');
            else return;
          }}
        />
      )}
    </>
  );
};

export default ServiceModal;
