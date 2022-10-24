import errorImg from 'Image/error_markcloud.png';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {

  const navigate = useNavigate();

  return (
    <article className='error-home'>
      <div className='oops-slide'>
        <span className='oops-txt'>
          {new Array(2000).fill(0).reduce(acc => `${acc} Oops!`, '')}
        </span>
      </div>
      <div className='error-wrap'>
        <div className='error-left'>
          <img src={errorImg} alt='마크클라우드 에러이미지' />
        </div>
        <div className='error-right'>
          <h2 className='error-big-txt'>:&#40;</h2>
          <div className='column'>
            <p>404 Not Found</p>
            <br />
            <span>페이지를 찾을 수 없습니다.</span>
            <div onClick={() => navigate(-1)}>이전 페이지로 돌아가기</div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ErrorPage;
