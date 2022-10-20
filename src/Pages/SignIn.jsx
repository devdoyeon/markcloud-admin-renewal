import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from 'JS/API';
import { setCookie, getCookie } from 'JS/cookie';
import { catchError } from 'JS/common';
import $ from 'jquery';
import cloudLogo from 'Image/logo.png';

const SignIn = () => {
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [check, setCheck] = useState(false);
  const obj = {
    emptyBoth: false,
    emptyId: false,
    emptyPw: false,
    wrongId: false,
    wrongPw: { bool: false, failCount: 0 },
  };
  const [formCheck, setFormCheck] = useState(obj);

  const navigate = useNavigate();

  useEffect(() => {
    //& 토큰을 가지고 있으면 홈으로 푸시
    if (getCookie('myToken')) navigate('/home');
    $('.input_id').focus();
  }, []);

  //~ 아이디 | 비밀번호 확인해서 틀리거나 빈 부분 알려주는 함수
  const checkForm = async (checkStr, bool, failCount) => {
    const obj = {
      emptyBoth: false,
      emptyId: false,
      emptyPw: false,
      wrongId: false,
      wrongPw: { bool: false, failCount: 0 },
    };
    obj[checkStr] = bool;
    if (failCount) obj[checkStr] = { bool: bool, failCount: failCount };
    setFormCheck(obj);
  };

  const login = async () => {
    //@ 아이디, 비밀번호 Input이 비어 있는지 확인
    if (userId.trim() === '' && userPw.trim() === '') {
      checkForm('emptyBoth', true);
      return;
    } else if (userId.trim() === '') {
      checkForm('emptyId', true);
      return;
    } else if (userPw.trim() === '') {
      checkForm('emptyPw', true);
      return;
    }
    const result = await signIn(userId, userPw);
    if (typeof result === 'object') {
      console.log(result);
      const { access_token, refresh_token } = result?.data?.data;
      setCookie('myToken', access_token, {
        path: '/',
        secure: true,
      });
      setCookie('rfToken', refresh_token, {
        path: '/',
        secure: true,
      });
      //@ 아이디 저장 체크 여부 확인 후 체크 되어 있으면 저장
      if (check === true) {
        localStorage.setItem('save-id', userId);
      } else localStorage.removeItem('save-id');
      navigate('/home');
    } else {
      //@ Error Handling
      const failCount = result?.split(',')[1];
      if (result === 'wrongId') {
        checkForm('wrongId', true);
      } else if (result === `wrongPw,${failCount}`) {
        checkForm('wrongPw', true, failCount);
      } else return catchError(result, navigate);
    }
  };

  const enterFn = e => {
    if (e.keyCode === 13) login();
    else return;
  };

  useEffect(() => {
    
  }, [formCheck])

  return (
    <div className='container signIn'>
      <div className='signInBox'>
        <img src={cloudLogo} alt='마크클라우드 로고' />
        <div className='form column'>
          <input
            type='text'
            placeholder='ID'
            autoComplete='off'
            value={userId}
            onKeyDown={e => enterFn(e)}
            onChange={e => setUserId(e.target.value)}
          />
          <input
            type='password'
            placeholder='PASSWORD'
            autoComplete='off'
            onChange={e => setUserPw(e.target.value)}
            onKeyDown={e => enterFn(e)}
          />
        </div>
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
        {formCheck.emptyBoth && (
          <span>
            <p className='white'>아이디</p>와 <p className='white'>비밀번호</p>
            를 입력해 주세요.
          </span>
        )}
        {formCheck.emptyId && (
          <span>
            <p className='white'>아이디</p>를 입력해 주세요.
          </span>
        )}
        {formCheck.emptyPw && (
          <span>
            <p className='white'>비밀번호</p>를 입력해 주세요.
          </span>
        )}
        {formCheck.wrongId && (
          <span>
            <p className='white'>아이디 또는 비밀번호</p>가 일치하지 않습니다.
            <br />
            다시 입력해 주세요.
          </span>
        )}
        {formCheck.wrongPw.bool && (
          <span>
            <p className='white'>비밀번호</p>를{' '}
            <p className='white'>{formCheck.wrongPw.failCount}번</p>{' '}
            틀리셨습니다.
            <br />
            다시 입력해 주세요.
          </span>
        )}
        <button onClick={login}>로그인</button>
      </div>
    </div>
  );
};

export default SignIn;
