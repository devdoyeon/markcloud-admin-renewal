import { useEffect } from 'react';
import { FaWindowClose } from 'react-icons/fa';
import { outClick } from 'JS/common';

const AdminApplyModal = ({ setModal }) => {
  useEffect(() => {
    window.addEventListener('click', e => outClick(e, setModal));
  });

  return (
    <div className='modal-background'>
      <div className='modal applyAdmin'>
        <div className='topBar'>
          <h2>관리자 등록</h2>
          <div onClick={() => setModal(false)}>
            <FaWindowClose />
          </div>
        </div>
        <div className='row infoInput'>
          <div className='column'>
            <div className='row'>
              <span>아이디</span>
              <input type='text' className='idInput' />
              <button className='duplicateCheck'>중복체크</button>
            </div>
            <div className='row'>
              <span>비밀번호</span>
              <input type='password' />
            </div>
            <div className='row'>
              <span>성별</span>
              <label className='row genderBox' htmlFor='male'>
                <p>남성</p>
                <input type='radio' name='gender' id='male' />
              </label>
              <label className='row genderBox' htmlFor='female'>
                <p>여성</p>
                <input type='radio' name='gender' id='female' />
              </label>
            </div>
            <div className='row'>
              <span>전화번호</span>
              <input type='text' />
            </div>
            <div className='row'>
              <span>권한</span>
              <select>
                <option value='super'>Super Admin</option>
                <option value='admin'>Admin</option>
              </select>
            </div>
          </div>
          <div className='column'>
            <div className='row'>
              <span>성명</span>
              <input type='text' />
            </div>
            <div className='row'>
              <span>생년월일</span>
              <input type='date' />
            </div>
            <div className='row'>
              <span>이메일</span>
              <input type='text' />
            </div>
          </div>
        </div>
        <button className='applyBtn'>등록</button>
      </div>
    </div>
  );
};

export default AdminApplyModal;
