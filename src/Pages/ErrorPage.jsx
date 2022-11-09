import errorIcon from 'Image/error_icon.png';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();
  const path = useLocation().pathname;

  useEffect(() => {
    document.title = 'Oops!';
    if (path === '/error') return;
    else if (path !== '/not-found') navigate('/not-found');
  }, []);

  return (
    <article className='error-home'>
      <div className='oops-slide'>
        <span className='oops-txt'>
          {new Array(3500).fill(0).reduce(acc => `${acc} Oops!`, '')}
        </span>
      </div>
      <div className='content-container'>
        <img src={errorIcon} alt='에러아이콘' />
        <strong>{path === '/error' ? '오류가 발생했습니다.' : '404 Not Found'}</strong>
        <p>
          {path === '/error'
            ? '잠시 후 다시 시도해 주세요.'
            : '페이지를 찾을 수 없습니다.'}
        </p>
        <a href='/' rel='noopener noreferrer' target='_self' className='middle'>
          홈으로 가기
        </a>
      </div>
    </article>
  );
};

export default ErrorPage;
