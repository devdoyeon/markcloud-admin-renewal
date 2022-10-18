import cloudLogo from 'Image/logo.png';

const SignIn = () => {
  return (
    <div className='container signIn'>
      <div className='signInBox'>
        <img src={cloudLogo} alt='마크클라우드 로고' />
        <div className='form column'>
          <input type='text' placeholder='ID' autoComplete='off'/>
          <input type='password' placeholder='PASSWORD' autoComplete='off'/>
        </div>
        <div className='remember-id'>
          <input type='checkbox' id='rememberId' />
          <label htmlFor='rememberId'>아이디 저장</label>
        </div>
        <hr />
        <button>로그인</button>
      </div>
    </div>
  );
};

export default SignIn;
