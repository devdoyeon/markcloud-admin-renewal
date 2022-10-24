import { useEffect } from 'react';
import { RiErrorWarningLine } from 'react-icons/ri';
import { commonModalSetting } from 'JS/common';

const CommonModal = ({ setModal, modal, okFn, failFn }) => {
  const domParser = new DOMParser();

  useEffect(() => {
    document.querySelector('.content').innerHTML = domParser.parseFromString(
      modal.context,
      'text/html'
    ).body.innerHTML;
  }, []);

  return (
    <div className='alert-modal'>
      <div className='modal'>
        <div className='head'>
          <RiErrorWarningLine />
        </div>
        <div className='content'></div>
        <div className='btn-wrap'>
          <button
            onClick={() => {
              if (modal.mode === 'confirm') {
                okFn();
                commonModalSetting(setModal, false);
              } else commonModalSetting(setModal, false, false);
            }}>
            확인
          </button>
          {modal.mode === 'confirm' && (
            <button
              onClick={() => {
                failFn();
                commonModalSetting(setModal, false);
              }}>
              취소
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommonModal;
