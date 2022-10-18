import { Link } from 'react-router-dom';
import cloudLogo from 'Image/logo.png';

const SideBar = () => {
  return (
    <>
      <div className='sideBar column'>
        <img src={cloudLogo} alt='마크클라우드 로고' />
        <ul className='mainMenu'>
          <Link to='/home'>
            <li>DASHBOARD</li>
          </Link>
          <li className='main'>관리</li>
          <Link to='/manage'>
            <li>회원 관리</li>
          </Link>
          <Link to='/inquiry'>
            <li>문의 관리</li>
          </Link>
          <Link to='/notice'>
            <li>공지 사항 관리</li>
          </Link>
          <Link to='/popup'>
            <li>팝업 관리</li>
          </Link>
          <li className='main'>이벤트</li>
          <Link to='/coupon'>
            <li>이벤트 쿠폰 발급</li>
          </Link>
          <li className='main'>서비스 바로가기</li>
          <a
            href='https://markcloud.co.kr'
            target='_blank'
            rel='noopener noreferrer'>
            <li>마크클라우드</li>
          </a>
          <a
            href='https://markcloud.co.kr/mark-view'
            target='_blank'
            rel='noopener noreferrer'>
            <li>마크뷰</li>
          </a>
          <a
            href='https://markcloud.co.kr/mark-link'
            target='_blank'
            rel='noopener noreferrer'>
            <li>마크링크</li>
          </a>
        </ul>
      </div>
      <div className='logoutBtn'>
        로그아웃
      </div>
    </>
  );
};

export default SideBar;
