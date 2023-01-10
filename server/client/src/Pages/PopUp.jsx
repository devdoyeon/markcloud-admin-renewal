import { useState, useEffect } from 'react';
import SideBar from 'Components/SideBar';
import Pagination from 'Components/Pagination';
import PopupApplyModal from 'Components/PopupApplyModal';
import CommonModal from 'Components/CommonModal';
import { commonModalSetting } from 'JS/common';

const PopUp = () => {
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    totalPage: 10,
    limit: 10,
  });
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const [info, setInfo] = useState({});
  const [view, setView] = useState(10);
  const [due, setDue] = useState('all');
  const [mode, setMode] = useState('');
  const [modal, setModal] = useState(false);

  useEffect(() => {
    document.title = '마크클라우드 관리자 > 팝업 관리';
  }, []);

  return (
    <>
      <div className='container'>
        <SideBar />
        <div className='content-wrap popup'>
          <div className='topBar'>
            <h2>POP-UP</h2>
            <div>
              <select value={view} onChange={e => setView(e.target.value)}>
                <option value={10}>10개씩 보기</option>
                <option value={30}>30개씩 보기</option>
                <option value={50}>50개씩 보기</option>
              </select>
              <select value={due} onChange={e => setDue(e.target.value)}>
                <option value='all'>전체 보기</option>
                <option value='now'>현재 게시 중</option>
                <option value='end'>게시 종료</option>
              </select>
              <button
                onClick={() => {
                  setMode('apply');
                  setModal(true);
                }}>
                팝업 추가
              </button>
            </div>
          </div>
          <div className='table-wrap'>
            <table>
              <colgroup>
                <col width='40%' />
                <col width='20%' />
                <col width='15%' />
                <col width='15%' />
                <col width='10%' />
              </colgroup>
              <thead>
                <tr>
                  <th>미리보기</th>
                  <th>링크</th>
                  <th>게시 날짜</th>
                  <th>게시 만료일</th>
                  <th>게시 상태</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
          <Pagination pageInfo={pageInfo} setPageInfo={setPageInfo} />
        </div>
      </div>
      {modal && (
        <PopupApplyModal
          setModal={setModal}
          mode={mode}
          info={info}
          setInfo={setInfo}
        />
      )}
      {alertBox.bool && (
        <CommonModal
          setModal={setAlertBox}
          modal={alertBox}
          okFn={() => {}}
          failFn={() => {}}
        />
      )}
    </>
  );
};

export default PopUp;
