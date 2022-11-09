import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCrown } from 'react-icons/fa';
import { MdOutlineMoodBad } from 'react-icons/md';
import SideBar from 'Components/SideBar';
import NoticeDetail from 'Components/NoticeDetail';
import InquiryDetail from 'Components/InquiryDetail';
import NoticeWrite from 'Components/NoticeWrite';
import CommonModal from 'Components/CommonModal';
import { catchError } from 'JS/common';
import {
  getSearchCount,
  getUserCount,
  getSearchKing,
  getInquiryList,
  getNoticeList,
} from 'JS/API';

const Home = () => {
  const [newUser, setNewUser] = useState('');
  const [allUser, setAllUser] = useState('');
  const [txtAll, setTxtAll] = useState('');
  const [txtToday, setTxtToday] = useState('');
  const [imgAll, setImgAll] = useState('');
  const [imgToday, setImgToday] = useState('');
  const [noticeId, setNoticeId] = useState('');
  const [inquiryId, setInquiryId] = useState('');
  const [state, setState] = useState('');

  const [textKing, setTextKing] = useState([]);
  const [imgKing, setImgKing] = useState([]);
  const [recentNotice, setRecentNotice] = useState([]);
  const [recentInquiry, setRecentInquiry] = useState([]);

  const [noticeModal, setNoticeModal] = useState(false);
  const [inquiryModal, setInquiryModal] = useState(false);
  const [editor, setEditor] = useState(false);

  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
    answer: '',
  });

  const navigate = useNavigate();
  let prevent = false;

  //@ 10
  const getInquiry = async () => {
    const result = await getInquiryList('no-answer', 1, 100);
    if (typeof result !== 'object')
      return catchError(result, navigate, setAlertBox);
    const date = new Date();
    const prevWeek = new Date(date);
    prevWeek.setDate(date.getDate() - 7);
    const arr = [];
    for (let obj of result.data.data)
      if (new Date(obj.created_at) >= prevWeek) arr.push(obj);
    setRecentInquiry(arr);
  };

  //@ 9
  const getNotice = async () => {
    const result = await getNoticeList(1, 100);
    if (typeof result !== 'object')
      return catchError(result, navigate, setAlertBox);
    const date = new Date();
    const prevWeek = new Date(date);
    prevWeek.setDate(date.getDate() - 7);
    const arr = [];
    for (let obj of result.data.data)
      if (new Date(obj.created_at) >= prevWeek) arr.push(obj);
    setRecentNotice(arr);
    getInquiry();
  };

  //@ 8
  const getTextKing = async () => {
    const result = await getSearchKing('text');
    if (typeof result !== 'object')
      return catchError(result, navigate, setAlertBox);
    setTextKing(result?.data?.data);
    getNotice();
  };

  //@ 7
  const getImgKing = async () => {
    const result = await getSearchKing('img');
    if (typeof result !== 'object')
      return catchError(result, navigate, setAlertBox);
    setImgKing(result?.data?.data);
    getTextKing();
  };

  //@ 6
  const getTodayImgSearch = async () => {
    const result = await getSearchCount('img_today');
    if (typeof result !== 'object')
      return catchError(result, navigate, setAlertBox);
    setImgToday(result?.data?.data);
    getImgKing();
  };

  //@ 5
  const getAllImgSearch = async () => {
    const result = await getSearchCount('img_all');
    if (typeof result !== 'object')
      return catchError(result, navigate, setAlertBox);
    setImgAll(result?.data?.data);
    getTodayImgSearch();
  };

  //@ 4
  const getTodayTxtSearch = async () => {
    const result = await getSearchCount('text_today');
    if (typeof result !== 'object')
      return catchError(result, navigate, setAlertBox);
    setTxtToday(result?.data?.data);
    getAllImgSearch();
  };

  //@ 3
  const getAllTxtSearch = async () => {
    const result = await getSearchCount('text_all');
    if (typeof result !== 'object')
      return catchError(result, navigate, setAlertBox);
    setTxtAll(result?.data?.data);
    getTodayTxtSearch();
  };

  //@ 2
  const getTodayUser = async () => {
    const result = await getUserCount('month');
    if (typeof result !== 'object')
      return catchError(result, navigate, setAlertBox);
    setNewUser(result?.data?.data);
    getAllTxtSearch();
  };

  //@ 1
  const getAllUser = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getUserCount('all');
    if (typeof result !== 'object')
      return catchError(result, navigate, setAlertBox);
    else {
      setState('ok');
      setAllUser(result?.data?.data);
      getTodayUser();
    }
  };

  const textKingBodyRender = () => {
    return textKing.reduce((acc, { user_id, name, search_count }, idx) => {
      const rank = idx + 1;
      return (
        <>
          {acc}
          <tr>
            <td>
              {rank <= 3 && (
                <>
                  <span className={`crown rank${rank}`}>
                    <FaCrown />
                  </span>
                  <br />
                </>
              )}
            </td>
            <td>{user_id}</td>
            <td>{name}</td>
            <td>{search_count}</td>
          </tr>
        </>
      );
    }, <></>);
  };

  const imgKingBodyRender = () => {
    return imgKing.reduce((acc, { user_id, name, search_count }, idx) => {
      const rank = idx + 1;
      return (
        <>
          {acc}
          <tr>
            <td>
              {rank <= 3 && (
                <>
                  <span className={`crown rank${rank}`}>
                    <FaCrown />
                  </span>
                  <br />
                </>
              )}
            </td>
            <td>{user_id}</td>
            <td>{name}</td>
            <td>{search_count}</td>
          </tr>
        </>
      );
    }, <></>);
  };

  const noticeListRender = () => {
    return recentNotice.reduce((acc, { title, admin_name, created_at, id }) => {
      return (
        <>
          {acc}
          <tr>
            <td
              onClick={() => {
                setNoticeId(id);
                setNoticeModal(true);
              }}
              className='title'>
              {title}
            </td>
            <td>{admin_name}</td>
            <td>{created_at.replaceAll('T', ' ')}</td>
          </tr>
        </>
      );
    }, <></>);
  };

  const inquiryListRender = () => {
    return recentInquiry.reduce((acc, { title, user_name, created_at, id }) => {
      return (
        <>
          {acc}
          <tr>
            <td
              onClick={() => {
                setInquiryId(id);
                setInquiryModal(true);
              }}
              className='title'>
              {title}
            </td>
            <td>{user_name}</td>
            <td>{created_at.replaceAll('T', ' ')}</td>
          </tr>
        </>
      );
    }, <></>);
  };

  const tableColGroup = m => {
    if (m === 'upload')
      return (
        <colgroup>
          <col width='50%' />
          <col width='20%' />
          <col width='30%' />
        </colgroup>
      );
    else if (m === 'king')
      return (
        <colgroup>
          <col width='15%' />
          <col width='40%' />
          <col width='30%' />
          <col width='15%' />
        </colgroup>
      );
  };

  useEffect(() => {
    if (state === '') {
      getAllUser();
      document.title = '마크클라우드 관리자 > 홈';
    }
    if (state === 'ok' && (!noticeModal || !editor)) getNotice();
    if (state === 'ok' && !inquiryModal) getInquiry();
  }, [noticeModal, editor, inquiryModal]);

  return (
    <div className='container'>
      <SideBar />
      <div className='content-wrap dashboard'>
        <h2>DASHBOARD</h2>
        <div className='row'>
          <div>
            <div className='title-wrap'>
              <h2>최근 업로드한 공지 사항</h2>
              <p>일주일 내에 업로드한 공지 사항만 표시 됩니다.</p>
            </div>
            {!recentNotice.length ? (
              <div className='none-list'>
                <MdOutlineMoodBad />
              </div>
            ) : (
              <div className='table-wrap'>
                <table>
                  {tableColGroup('upload')}
                  <thead>
                    <tr>
                      <th>제목</th>
                      <th>작성자</th>
                      <th>공지 날짜</th>
                    </tr>
                  </thead>
                  <tbody>{noticeListRender()}</tbody>
                </table>
              </div>
            )}
          </div>
          <div>
            <div className='title-wrap'>
              <h2>최근 업로드 된 문의 사항</h2>
              <p>일주일 내에 업로드 된 미답변 문의 사항만 표시 됩니다.</p>
            </div>
            {!recentInquiry.length ? (
              <div className='none-list'>
                <MdOutlineMoodBad />
              </div>
            ) : (
              <div className='table-wrap'>
                <table>
                  {tableColGroup('upload')}
                  <thead>
                    <tr>
                      <th>제목</th>
                      <th>작성자</th>
                      <th>문의 날짜</th>
                    </tr>
                  </thead>
                  <tbody>{inquiryListRender()}</tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <div className='row'>
          <div>
            <div className='title-wrap'>
              <h2>회원 현황</h2>
            </div>
            <div className='count-wrap column'>
              <div className='count'>
                {newUser} / {allUser}
              </div>
              <div>신규 / 전체</div>
            </div>
          </div>
          <div>
            <div className='title-wrap'>
              <h2>텍스트 검색 현황</h2>
            </div>
            <div className='count-wrap column'>
              <div className='count'>
                {txtToday} / {txtAll}
              </div>
              <div>오늘 / 전체</div>
            </div>
          </div>
          <div>
            <div className='title-wrap'>
              <h2>이미지 검색 현황</h2>
            </div>
            <div className='count-wrap column'>
              <div className='count'>
                {imgToday} / {imgAll}
              </div>
              <div>오늘 / 전체</div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div>
            <div className='title-wrap'>
              <h2>텍스트 검색 순위</h2>
              <p>최대 다섯 명까지 표시 됩니다.</p>
            </div>
            {!textKing.length ? (
              <div className='none-list'>
                <MdOutlineMoodBad />
              </div>
            ) : (
              <div className='table-wrap king'>
                <table>
                  {tableColGroup('king')}
                  <thead>
                    <tr>
                      <th>순위</th>
                      <th>아이디</th>
                      <th>이름</th>
                      <th>검색횟수</th>
                    </tr>
                  </thead>
                  <tbody>{textKingBodyRender()}</tbody>
                </table>
              </div>
            )}
          </div>
          <div>
            <div className='title-wrap'>
              <h2>이미지 검색 순위</h2>
              <p>최대 다섯 명까지 표시 됩니다.</p>
            </div>
            {!imgKing.length ? (
              <div className='none-list'>
                <MdOutlineMoodBad />
              </div>
            ) : (
              <div className='table-wrap king'>
                <table>
                  {tableColGroup('king')}
                  <thead>
                    <tr>
                      <th>순위</th>
                      <th>아이디</th>
                      <th>이름</th>
                      <th>검색횟수</th>
                    </tr>
                  </thead>
                  <tbody>{imgKingBodyRender()}</tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      {noticeModal && (
        <NoticeDetail
          noticeId={noticeId}
          setModal={setNoticeModal}
          setEditor={setEditor}
        />
      )}
      {inquiryModal && (
        <InquiryDetail inquiryId={inquiryId} setModal={setInquiryModal} />
      )}
      {editor && (
        <NoticeWrite
          noticeId={noticeId}
          setModal={setNoticeModal}
          setEditor={setEditor}
        />
      )}
      {alertBox.bool && <CommonModal setModal={setAlertBox} modal={alertBox} />}
    </div>
  );
};

export default Home;
