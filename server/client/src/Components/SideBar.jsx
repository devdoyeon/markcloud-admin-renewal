import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CommonModal from './CommonModal';
import { commonModalSetting } from 'JS/common';
import { removeCookie } from 'JS/cookie';
import cloudLogo from 'Image/logo.png';

const SideBar = () => {
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const path = useLocation().pathname;
  const navigate = useNavigate();

  return (
    <>
      <div className='sideBar column'>
        <Link to='/home'>
          <img src={cloudLogo} alt='마크클라우드 로고' />
        </Link>
        <ul className='mainMenu'>
          <Link to='/home'>
            <li className={path === '/home' && 'active'}>DASHBOARD</li>
          </Link>
          <li className='main'>관리</li>
          <Link to='/manage'>
            <li className={path === '/manage' && 'active'}>회원 관리</li>
          </Link>
          {localStorage.getItem('admin_role') === 'super_admin' ? (
            <Link to='/admin-manage'>
              <li className={path === '/admin-manage' && 'active'}>
                관리자 계정 관리
              </li>
            </Link>
          ) : (
            ''
          )}
          <Link to='/inquiry'>
            <li className={path === '/inquiry' && 'active'}>문의 사항 관리</li>
          </Link>
          <Link to='/notice'>
            <li className={path === '/notice' && 'active'}>공지 사항 관리</li>
          </Link>
          <Link to='/popup'>
            <li className={path === '/popup' && 'active'}>팝업 관리</li>
          </Link>
          {localStorage.getItem('admin_role') === 'super_admin' ? (
            <>
              <Link to='/service'>
                <li className={path === '/service' && 'active'}>서비스 관리</li>
              </Link>
              <Link to='/product'>
                <li className={path === '/product' && 'active'}>상품 관리</li>
              </Link>
            </>
          ) : (
            ''
          )}
          <Link to='/usa-cache'>
            <li className={path === '/usa-cache' && 'active'}>
              해외 데이터 캐시 관리
            </li>
          </Link>
          <li className='main'>이벤트</li>
          <Link to='/event'>
            <li className={path === '/event' && 'active'}>
              이벤트 쿠폰 발급 내역
            </li>
          </Link>
          <li className='main'>통계</li>
          <Link to='/statistic'>
            <li className={path === '/statistic' && 'active'}>통계</li>
          </Link>
          <li className='main'>바로가기</li>
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
          {/* <a
            href='https://markcloud.co.kr/mark-link'
            target='_blank'
            rel='noopener noreferrer'>
            <li>마크링크</li>
          </a> */}
          <li
            onClick={() =>
              commonModalSetting(
                setAlertBox,
                true,
                'alert',
                '서비스 준비 중입니다.'
              )
            }>
            마크링크
          </li>
          <a
            href='https://markcloud.co.kr/mark-groupware'
            target='_blank'
            rel='noopener noreferrer'>
            <li>마크그룹웨어</li>
          </a>
        </ul>
        <div
          className='logoutBtn'
          onClick={() => {
            removeCookie('adminMyToken');
            removeCookie('adminRfToken');
            localStorage.clear();
            return navigate('/');
          }}>
          로그아웃
        </div>
      </div>
      {alertBox.bool && (
        <CommonModal setModal={setAlertBox} modal={alertBox} okFn={() => {}} />
      )}
    </>
  );
};

export default SideBar;
