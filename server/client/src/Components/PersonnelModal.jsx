import { useEffect } from 'react';
import { FaWindowClose } from 'react-icons/fa';
import { outClick } from 'JS/common';

const PersonnelModal = ({ setEditModal, info }) => {
  useEffect(() => {
    window.addEventListener('click', e => outClick(e, setEditModal));
  });

  return (
    <div className='modal-background'>
      <div className='modal personnel'>
        <div className='topBar'>
          <h3>회원 상세보기</h3>
          <div onClick={() => setEditModal(false)}>
            <FaWindowClose />
          </div>
        </div>
        <div className='personnelInput column'>
          <div className='row'>
            <span>아이디</span>
            <div className='infoInput'>{info.id}</div>
          </div>
          <div className='row'>
            <div className='row name'>
              <span>성명</span>
              <div className='infoInput'>{info.name}</div>
            </div>
            <div className='blank'></div>
            <div className='row gender'>
              {' '}
              <span>성별</span>
              <div className='infoInput'>
                {info.gender === 'F' ? '여성' : '남성'}
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='row birth'>
              <span>생년월일</span>
              <div className='infoInput'>{info.birth}</div>
            </div>
            <div className='blank'></div>
            <div className='row department'>
              <span>소속</span>
              <div className='infoInput'>{info.department}</div>
            </div>
          </div>
          <div className='row'>
            <span>전화번호</span>
            <div className='infoInput'>{info.phone}</div>
          </div>
          <div className='row'>
            <span>이메일</span>
            <div className='infoInput'>{info.email}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonnelModal;
