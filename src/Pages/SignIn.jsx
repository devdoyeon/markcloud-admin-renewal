import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import CommonModal from 'Components/CommonModal';
import { signIn } from 'JS/API';
import { setCookie, getCookie } from 'JS/cookie';
import { catchError, commonModalSetting, enterFn } from 'JS/common';
import cloudLogo from 'Image/logo.png';

const SignIn = () => {
  const obj = {
    emptyBoth: false,
    emptyId: false,
    emptyPw: false,
    wrongId: false,
    wrongPw: { bool: false, failCount: 0 },
    retired: false,
  };
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [check, setCheck] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [formCheck, setFormCheck] = useState(obj);
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });

  const navigate = useNavigate();

  //~ 아이디 비밀번호 EmptyInput 확인 함수
  const checkForm = async (checkStr, bool, failCount) => {
    const obj = {
      emptyBoth: false,
      emptyId: false,
      emptyPw: false,
      wrongId: false,
      wrongPw: { bool: false, failCount: 0 },
      retired: false,
    };
    obj[checkStr] = bool;
    if (failCount) obj[checkStr] = { bool: bool, failCount: failCount };
    setFormCheck(obj);
  };

  const login = async () => {
    //@ 아이디, 비밀번호 Input이 비어 있는지 확인
    if (userId.trim() === '' && userPw.trim() === '')
      return checkForm('emptyBoth', true);
    else if (userId.trim() === '') return checkForm('emptyId', true);
    else if (userPw.trim() === '') return checkForm('emptyPw', true);
    const result = await signIn(userId, userPw);
    if (typeof result === 'object') {
      const { access_token, refresh_token, role } = result?.data?.data;
      setCookie('adminMyToken', access_token, {
        path: '/',
        secure: false,
      });
      setCookie('adminRfToken', refresh_token, {
        path: '/',
        secure: false,
      });
      localStorage.setItem('admin_role', role);
      //@ 아이디 저장 체크 여부 확인 후 체크 되어 있으면 저장
      if (check) localStorage.setItem('save-id', userId);
      else localStorage.removeItem('save-id');
      navigate('/home');
    } else {
      //@ Error Handling
      const failCount = result?.split(',')[1];
      if (result === 'wrongId') checkForm('wrongId', true);
      else if (result === `wrongPw,${failCount}`)
        checkForm('wrongPw', true, failCount);
      else if (result === 'retired') checkForm('retired', true);
      else return catchError(result, navigate, setAlertBox, setAlert);
    }
  };

  useEffect(() => {
    //& 토큰을 가지고 있으면 홈으로 푸시
    if (getCookie('adminMyToken')) navigate('/home');
    if (localStorage.getItem('save-id')) {
      setUserId(localStorage.getItem('save-id'));
      setCheck(true);
      $('.input_pw').focus();
    } else $('.input_id').focus();
    document.title = '마크클라우드 관리자 로그인';
  }, []);

  useEffect(() => {
    let context;
    if (formCheck.emptyBoth) context = '아이디와 비밀번호를 입력해 주세요.';
    else if (formCheck.emptyId) context = '아이디를 입력해 주세요.';
    else if (formCheck.emptyPw) context = '비밀번호를 입력해 주세요.';
    else if (formCheck.wrongId) {
      context = `아이디 혹은 비밀번호가 일치하지 않습니다.<br/>다시 입력해 주세요.`;
      setUserId('');
      setUserPw('');
    } else if (formCheck.wrongPw.bool) {
      context = `비밀번호를 ${formCheck.wrongPw.failCount}회 틀리셨습니다.<br/>다시 입력해 주세요.`;
      setUserPw('');
    } else if (formCheck.retired) {
      context = `탈퇴된 아이디입니다.`;
    } else context = '';
    if (context.trim() !== '')
      commonModalSetting(setAlertBox, true, 'alert', context);
  }, [formCheck]);

  return (
    <div className='container signIn'>
      <div className='signInBox'>
        <img src={cloudLogo} alt='마크클라우드 로고' />
        <div className='form column'>
          <input
            type='text'
            placeholder='ID'
            autoComplete='off'
            className='input_id'
            value={userId}
            onKeyDown={e => {
              if (!alertBox.bool) enterFn(e, login);
              setCapsLock(e.getModifierState('CapsLock'));
            }}
            onChange={e => setUserId(e.target.value)}
          />
          <input
            type='password'
            placeholder='PASSWORD'
            autoComplete='off'
            className='input_pw'
            value={userPw}
            onChange={e => setUserPw(e.target.value)}
            onKeyDown={e => {
              if (!alertBox.bool) enterFn(e, login);
              setCapsLock(e.getModifierState('CapsLock'));
            }}
          />
        </div>
        {capsLock && (
          <p>
            <span>CapsLock</span>이 켜져 있습니다.
          </p>
        )}
        <div className='remember-id'>
          <input
            type='checkbox'
            id='rememberId'
            checked={check}
            onChange={e => setCheck(e.target.checked)}
          />
          <label htmlFor='rememberId'>아이디 저장</label>
        </div>
        <hr />
        <button onClick={login}>로그인</button>
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
    </div>
  );
};

export default SignIn;
