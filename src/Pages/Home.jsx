import { useState, useEffect } from 'react';
import SideBar from 'Components/SideBar';
import { useNavigate } from 'react-router-dom';
import {
  searchCount,
  userCount,
  searchKing,
  getInquiryList,
  getNotice,
} from 'JS/API';
import { catchError } from 'JS/common';
import { FaCrown } from 'react-icons/fa';
import { MdOutlineMoodBad } from 'react-icons/md';
import NoticeDetail from 'Components/NoticeDetail';
import InquiryDetail from 'Components/InquiryDetail';
import NoticeWrite from 'Components/NoticeWrite';

const Home = () => {
  const [newUser, setNewUser] = useState('');
  const [allUser, setAllUser] = useState('');
  const [txtAll, setTxtAll] = useState('');
  const [txtToday, setTxtToday] = useState('');
  const [imgAll, setImgAll] = useState('');
  const [imgToday, setImgToday] = useState('');
  const [textKing, setTextKing] = useState([]);
  const [imgKing, setImgKing] = useState([]);
  const [recentNotice, setRecentNotice] = useState([]);
  const [recentInquiry, setRecentInquiry] = useState([]);

  const [noticeModal, setNoticeModal] = useState(false);
  const [inquiryModal, setInquiryModal] = useState(false);
  const [editor, setEditor] = useState(false);
  const [noticeId, setNoticeId] = useState('');
  const [inquiryId, setInquiryId] = useState('');

  const navigate = useNavigate();
  let prevent = false;

  //@ 9
  const getInquiry = async () => {
    const date = new Date();
    const prevDate = new Date(date);
    prevDate.setDate(date.getDate() - 7);
    const result = await getInquiryList('no-answer', 1, 100);
    if (typeof result === 'object') {
      const arr = [];
      for (let obj of result.data.data) {
        if (new Date(obj.created_at) >= prevDate) {
          arr.push(obj);
        }
      }
      setRecentInquiry(arr);
    } else return catchError(result, navigate);
  };

  //@ 9
  const getNoticeList = async () => {
    const date = new Date();
    const prevDate = new Date(date);
    prevDate.setDate(date.getDate() - 7);
    const result = await getNotice(1, 100);
    if (typeof result === 'object') {
      const arr = [];
      for (let obj of result.data.data) {
        if (new Date(obj.created_at) >= prevDate) {
          arr.push(obj);
        }
      }
      setRecentNotice(arr);
      getInquiry();
    } else return catchError(result, navigate);
  };

  //@ 8
  const getTextKing = async () => {
    const result = await searchKing('text');
    if (typeof result === 'object') {
      setTextKing(result?.data?.data);
      getNoticeList();
    } else return catchError(result, navigate);
  };

  //@ 7
  const getImgKing = async () => {
    const result = await searchKing('img');
    if (typeof result === 'object') {
      setImgKing(result?.data?.data);
      getTextKing();
    } else return catchError(result, navigate);
  };

  //@ 6
  const getTodayImgSearch = async () => {
    const result = await searchCount('img_today');
    if (typeof result === 'object') {
      setImgToday(result?.data?.data);
      getImgKing();
    } else return catchError(result, navigate);
  };

  //@ 5
  const getAllImgSearch = async () => {
    const result = await searchCount('img_all');
    if (typeof result === 'object') {
      setImgAll(result?.data?.data);
      getTodayImgSearch();
    } else return catchError(result, navigate);
  };

  //@ 4
  const getTodayTxtSearch = async () => {
    const result = await searchCount('text_today');
    if (typeof result === 'object') {
      setTxtToday(result?.data?.data);
      getAllImgSearch();
    } else return catchError(result, navigate);
  };

  //@ 3
  const getAllTxtSearch = async () => {
    const result = await searchCount('text_all');
    if (typeof result === 'object') {
      setTxtAll(result?.data?.data);
      getTodayTxtSearch();
    } else return catchError(result, navigate);
  };

  //@ 2
  const getTodayUser = async () => {
    const result = await userCount('month');
    if (typeof result === 'object') {
      setNewUser(result?.data?.data);
      getAllTxtSearch();
    } else return catchError(result, navigate);
  };

  //@ 1
  const getAllUser = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await userCount('all');
    if (typeof result === 'object') {
      setAllUser(result?.data?.data);
      getTodayUser();
    } else {
      return catchError(result, navigate);
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
              NO.{rank}
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
              NO.{rank}
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

  useEffect(() => {
    if (noticeModal === false || inquiryModal === false || editor === false) {
      getAllUser();
    }
  }, [noticeModal, inquiryModal, editor]);

  return (
    <div className='container'>
      <SideBar />
      <div className='content-wrap dashboard'>
        <h2>DASHBOARD</h2>
        <div className='row'>
          <div>
            <div className='title-wrap'>
              <h2>최근 업로드한 공지 사항</h2>
              <p>일주일 내에 업로드한 공지 사항만 표시됩니다.</p>
            </div>
            {recentNotice.length === 0 ? (
              <div className='none-list'>
                <MdOutlineMoodBad />
              </div>
            ) : (
              <div className='table-wrap'>
                <table>
                  <colgroup>
                    <col width='50%' />
                    <col width='20%' />
                    <col width='30%' />
                  </colgroup>
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
              <p>일주일 내에 업로드 된 미답변 문의 사항만 표시됩니다.</p>
            </div>
            {recentInquiry.length === 0 ? (
              <div className='none-list'>
                <MdOutlineMoodBad />
              </div>
            ) : (
              <div className='table-wrap'>
                <table>
                  <colgroup>
                    <col width='50%' />
                    <col width='20%' />
                    <col width='30%' />
                  </colgroup>
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
              <p>최대 다섯 명까지 표시됩니다.</p>
            </div>
            {textKing.length === 0 ? (
              <div className='none-list'>
                <MdOutlineMoodBad />
              </div>
            ) : (
              <div className='table-wrap king'>
                <table>
                  <colgroup>
                    <col width='15%' />
                    <col width='40%' />
                    <col width='30%' />
                    <col width='15%' />
                  </colgroup>
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
              <p>최대 다섯 명까지 표시됩니다.</p>
            </div>
            {imgKing.length === 0 ? (
              <div className='none-list'>
                <MdOutlineMoodBad />
              </div>
            ) : (
              <div className='table-wrap king'>
                <table>
                  <colgroup>
                    <col width='15%' />
                    <col width='40%' />
                    <col width='30%' />
                    <col width='15%' />
                  </colgroup>
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
    </div>
  );
};

export default Home;
