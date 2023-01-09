import { useState, useEffect } from 'react';
import CommonModal from './CommonModal';
import { FaWindowClose } from 'react-icons/fa';
import {
  outClick,
  changeState,
  commonModalSetting,
  regularExpression,
  addHyphen,
} from 'JS/common';
import { idDuplicateCheck } from 'JS/API';

const AdminApplyModal = ({ setModal, mode, setInfo, info }) => {
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const [idCheck, setIdCheck] = useState('');
  const [render, setRender] = useState(false);

  useEffect(() => {
    window.addEventListener('click', e => outClick(e, setModal));
  });

  const duplicateCheck = async () => {
    if (info?.user_id?.trim() === '')
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '아이디를 입력해 주세요.'
      );
    else if (regularExpression('id', info?.id))
      commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '아이디 형식이 잘못되었습니다.<br/>아이디는 4자리에서 30자리까지 가능합니다.'
      );
    else {
      const result = await idDuplicateCheck(info?.user_id);
      setRender(true);
      if (typeof result === 'object') {
        setIdCheck(true);
      } else {
        setIdCheck(false);
      }
    }
  };

  const applyAdmin = async () => {
    if (!idCheck)
      commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '아이디 중복확인을 해 주세요.'
      );
    else if (info?.pw.trim() === '')
      commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '비밀번호를 입력해 주세요.'
      );
    else if (regularExpression('pw', info?.pw))
      commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '비밀번호 형식이 잘못되었습니다.<br/>비밀번호는 특수문자를 포함하여<br/>8 ~ 20자리만 가능합니다.'
      );
    else if (info?.gender.trim() === '')
      commonModalSetting(setAlertBox, true, 'alert', '성별을 선택해 주세요.');
    else if (info?.phone.trim() === '')
      commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '전화번호를 입력해 주세요.'
      );
    else if (info?.phone?.length !== 13)
      commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '전화번호 형식이 잘못되었습니다.<br/>다시 확인해 주세요.'
      );
    else if (info?.name.trim() === '')
      commonModalSetting(setAlertBox, true, 'alert', '성명을 입력해 주세요.');
    else if (info?.email.trim() === '')
      commonModalSetting(setAlertBox, true, 'alert', '이메일을 입력해 주세요.');
    else if (regularExpression('email', info?.email))
      commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '이메일의 형식이 잘못되었습니다.<br/>다시 확인해 주세요.'
      );
  };

  return (
    <>
      <div className='modal-background'>
        <div className='modal applyAdmin'>
          <div className='topBar'>
            <h2>{mode === 'apply' ? '관리자 등록' : '관리자 수정'}</h2>
            <div onClick={() => setModal(false)}>
              <FaWindowClose />
            </div>
          </div>
          <div className='row infoInput'>
            <div className='column'>
              <div className='row id'>
                <span>아이디</span>
                {mode === 'edit' ? (
                  <span className='fixedInput'>{info?.user_id}</span>
                ) : (
                  <>
                    <input
                      type='text'
                      className='idInput'
                      value={info?.user_id}
                      onChange={e => {
                        setRender(false);
                        changeState(setInfo, 'user_id', e.target.value);
                      }}
                    />
                    <button className='duplicateCheck' onClick={duplicateCheck}>
                      중복체크
                    </button>
                  </>
                )}
              </div>
              {idCheck ? (
                <span className={`idCheck ${render ? 'active canUsed' : ''}`}>
                  사용할 수 있는 아이디입니다.
                </span>
              ) : (
                <span className={`idCheck ${render ? 'active cantUsed' : ''}`}>
                  사용할 수 없는 아이디입니다.
                </span>
              )}
              <div className='row'>
                <span>비밀번호</span>
                <input
                  type='password'
                  value={info?.pw}
                  onChange={e => changeState(setInfo, 'pw', e.target.value)}
                />
              </div>
              <div className='row'>
                <span>성별</span>
                {mode === 'edit' ? (
                  info?.gender === 'M' ? (
                    <span className='fixedInput'>남성</span>
                  ) : (
                    <span className='fixedInput'>여성</span>
                  )
                ) : (
                  <>
                    <label className='row genderBox' htmlFor='male'>
                      <p>남성</p>
                      <input
                        type='radio'
                        name='gender'
                        id='male'
                        value='M'
                        onChange={e =>
                          changeState(setInfo, 'gender', e.target.value)
                        }
                      />
                    </label>
                    <label className='row genderBox' htmlFor='female'>
                      <p>여성</p>
                      <input
                        type='radio'
                        name='gender'
                        id='female'
                        value='F'
                        onChange={e =>
                          changeState(setInfo, 'gender', e.target.value)
                        }
                      />
                    </label>
                  </>
                )}
              </div>
              <div className='row'>
                <span>전화번호</span>
                <input
                  type='text'
                  value={info?.phone}
                  onChange={e =>
                    changeState(setInfo, 'phone', addHyphen(e.target.value))
                  }
                />
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
                {mode === 'edit' ? (
                  <span className='fixedInput'>{info?.name}</span>
                ) : (
                  <input
                    type='text'
                    value={info?.name}
                    onChange={e => changeState(setInfo, 'name', e.target.value)}
                  />
                )}
              </div>
              <div className='row'>
                <span>생년월일</span>
                <input
                  type='date'
                  value={info?.birth}
                  onChange={e => changeState(setInfo, 'birth', e.target.value)}
                  readOnly={mode === 'edit'}
                />
              </div>
              <div className='row'>
                <span>이메일</span>
                <input
                  type='text'
                  value={info?.email}
                  onChange={e => changeState(setInfo, 'email', e.target.value)}
                />
              </div>
            </div>
          </div>
          <button className='applyBtn' onClick={applyAdmin}>
            {mode === 'edit' ? '수정' : '등록'}
          </button>
        </div>
      </div>
      {alertBox.bool && (
        <CommonModal setModal={setAlertBox} modal={alertBox} okFn={() => {}} />
      )}
    </>
  );
};

export default AdminApplyModal;
