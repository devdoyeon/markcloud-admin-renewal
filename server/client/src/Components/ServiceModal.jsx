import { useState, useEffect } from 'react';
import { changeState } from 'JS/common';
import { createService, editService, deleteService } from 'JS/API';

const ServiceModal = ({ mode, setModal, info, setInfo }) => {
  const [origin, setOrigin] = useState('');

  const newService = async () => {
    const result = await createService(info);
    if (typeof result === 'object') {
      setInfo({
        service_code: '',
        service_name: '',
      });
      setModal(false);
    }
  };

  const modifyService = async () => {
    const result = await editService(origin, info);
    if (typeof result === 'object') {
      setInfo({
        service_code: '',
        service_name: '',
      });
      setModal(false);
    }
  };

  const removeService = async () => {
    const result = await deleteService(info.service_code);
    if (typeof result === 'object') {
      setInfo({
        service_code: '',
        service_name: '',
      });
      setModal(false);
    }
  };

  useEffect(() => {
    if (mode === 'edit') setOrigin(info.service_code);
    else return;
  }, [mode]);

  return (
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
  );
};

export default ServiceModal;
