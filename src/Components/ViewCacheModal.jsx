import { useState, useEffect } from 'react';
import { FaWindowClose } from 'react-icons/fa';
import { CopyBlock, monokaiSublime } from 'react-code-blocks';
import Pagination from './Pagination';
import { changeState } from 'JS/common';

const ViewCacheModal = ({ arr, setModal }) => {
  const [pageInfo, setPageInfo] = useState({
    totalPage: '',
    page: 1,
  });
  const [movePage, setMovePage] = useState(1);

  const outClick = e => {
    if (e.target.className === 'modal-background') {
      setModal(false);
      window.removeEventListener('click', outClick);
    }
  };

  const enterFn = e => {
    if (e.key === 'Enter') changeState(setPageInfo, 'page', Number(movePage));
  };

  useEffect(() => {
    window.addEventListener('click', e => outClick(e));
    changeState(setPageInfo, 'totalPage', arr.length);
  }, []);

  return (
    <div className='modal-background'>
      <div className='modal cache'>
        <div className='topBar'>
          <h2>Cache Detail</h2>
          <div onClick={() => setModal(false)}>
            <FaWindowClose />
          </div>
        </div>
        <div className='codeBlock'>
        <CopyBlock
          text={JSON.stringify(arr[pageInfo.page - 1], null, 2)}
          language={'json'}
          showLineNumbers={false}
          theme={monokaiSublime}
        />
        </div>
        <div className='pagination-wrap'>
          <Pagination pageInfo={pageInfo} setPageInfo={setPageInfo} />
          <div className='searchPage'>
            <input
              type='text'
              defaultValue={pageInfo.page}
              onChange={e => setMovePage(Number(e.target.value))}
              onKeyDown={e => enterFn(e)}
            />
            /{pageInfo.totalPage}
            <button
              onClick={() =>
                changeState(setPageInfo, 'page', Number(movePage))
              }>
              이동
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCacheModal;
