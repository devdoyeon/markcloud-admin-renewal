import { useState, useEffect } from 'react';
import { FaWindowClose } from 'react-icons/fa';
import { CopyBlock, monokaiSublime } from 'react-code-blocks';
import Pagination from './Pagination';
import { changeState, enterFn, outClick } from 'JS/common';

const ViewCacheModal = ({ arr, setModal }) => {
  const [pageInfo, setPageInfo] = useState({
    totalPage: '',
    page: 1,
  });
  const [movePage, setMovePage] = useState(1);

  useEffect(() => {
    window.addEventListener('click', e => outClick(e, setModal));
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
        {arr.length <= 0 ? (
          <div className='column none-cache'>
            캐시가 없습니다.
          </div>
        ) : (
          <>
            {' '}
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
                  onKeyDown={e =>
                    enterFn(e, () => {
                      if (
                        Number(movePage) > arr.length ||
                        Number(movePage) <= 0
                      )
                        return alert('페이지를 정확히 입력해 주세요.');
                      changeState(setPageInfo, 'page', Number(movePage));
                    })
                  }
                />
                /{pageInfo.totalPage}
                <button
                  onClick={() => {
                    if (Number(movePage) > arr.length || Number(movePage) <= 0)
                      return alert('페이지를 정확히 입력해 주세요.');
                    changeState(setPageInfo, 'page', Number(movePage));
                  }}>
                  이동
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewCacheModal;
