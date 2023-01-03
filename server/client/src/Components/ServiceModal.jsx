import { useEffect } from 'react';
import { changeState } from 'JS/common';

const ServiceModal = ({ mode, setModal, info, setInfo }) => {
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
              value={info?.code}
              onChange={e =>
                changeState(setInfo, 'code', Number(e.target.value))
              }
            />
          </div>
          <div className='row'>
            <span>서비스명</span>
            <input
              type='text'
              placeholder='서비스명을 입력해 주세요.'
              value={info?.name}
              onChange={e => changeState(setInfo, 'name', e.target.value)}
            />
          </div>
        </div>
        <div className='btn-wrap row'>
          {mode === 'apply' || <button>수정</button>}
          <button>{mode === 'apply' ? '등록' : '삭제'}</button>
          <button
            onClick={() => {
              setModal(false);
              setInfo({
                code: '',
                name: '',
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
