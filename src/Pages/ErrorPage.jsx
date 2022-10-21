import errorImg from 'Image/error_markcloud.png';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  const renderOops = num => {
    return new Array(num).fill(0).reduce(acc => `${acc} Oops!`, '');
  };

  return (
    <article className='error-home'>
      <div className='oops-slide'>
        <span className='oops-txt'>{renderOops(2000)}</span>
      </div>
      <div className='error-wrap'>
        <div className='error-left'>
          <img src={errorImg} alt='마크클라우드 에러이미지' />
        </div>
        <div className='error-right'>
          <h2 className='error-big-txt'>:(</h2>
          <div className='column'>
            <p>404 Not Found</p>
            <br />
            <span>페이지를 찾을 수 없습니다.</span>
            <Link to='/home'>홈으로 돌아가기</Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ErrorPage;
