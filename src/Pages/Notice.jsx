import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import $ from 'jquery';
import SideBar from 'Components/SideBar';
import Pagination from 'Components/Pagination';
import { getNotice, noticeMultiDelete } from 'JS/API';
import { serviceCodeToString } from 'JS/array';
import { catchError } from 'JS/common';
import NoticeDetail from 'Components/NoticeDetail';
import NoticeWrite from 'Components/NoticeWrite';

const Notice = () => {
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    totalPage: 10,
    limit: 10,
  });
  const [noticeList, setNoticeList] = useState([]);
  const [idArr, setIdArr] = useState([]);
  const [modal, setModal] = useState(false);
  const [id, setId] = useState('');
  const [editor, setEditor] = useState(false);

  let prevent = false;
  const navigate = useNavigate();

  const getNoticeList = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getNotice(pageInfo.page, pageInfo.limit);
    if (typeof result === 'object') {
      setNoticeList(result?.data?.data);
      setPageInfo(prev => {
        const clone = { ...prev };
        clone.totalPage = result.data.meta.totalPage;
        return clone;
      });
    } else return catchError(result, navigate);
  };

  const checkAll = () => {
    let arr = [];
    if ($('.notice-all-check').is(':checked')) {
      $('.notice-check').prop('checked', true);
      const all = $('.notice-check').length;
      for (let i = 0; i < all; i++) {
        const val = document.getElementsByClassName('notice-check')[i].value;
        arr.push(val);
        setIdArr(arr);
      }
    } else {
      $('.notice-check').prop('checked', false);
      setIdArr([]);
    }
  };

  const multiDel = async () => {
    if (!idArr.length) return alert('삭제할 글을 선택해 주세요.');
    if (
      !window.confirm('삭제하면 복구할 수 없습니다.\n정말 삭제하시겠습니까?')
    ) {
      $('.notice-all-check').prop('checked', false);
      $('.notice-check').prop('checked', false);
      setIdArr([]);
      return;
    } else {
      const data = { items: idArr };
      const result = await noticeMultiDelete(data);
      if (typeof result === 'object') {
        alert('삭제되었습니다.');
        $('.notice-all-check').prop('checked', false);
        $('.notice-check').prop('checked', false);
        setPageInfo(prev => {
          const clone = { ...prev };
          clone.page = 1;
          return clone;
        });
        setIdArr([]);
        getNoticeList();
      } else return catchError(result, navigate);
    }
  };

  const renderTableBody = () => {
    return noticeList.reduce(
      (acc, { title, created_at, service_code, id, admin_name }) => {
        const checkEach = () => {
          let all = $('.notice-check').length;
          let checked = $('.notice-check:checked').length;
          let arr = [];
          if (all !== checked) $('.notice-all-check').prop('checked', false);
          else $('.notice-all-check').prop('checked', true);
          for (let i = 0; i < all; i++) {
            if (document.getElementsByClassName('notice-check')[i].checked) {
              const val =
                document.getElementsByClassName('notice-check')[i].value;
              arr.push(val);
              setIdArr(arr);
            }
          }
        };
        return (
          <>
            {acc}
            <tr>
              <td>
                <input
                  type='checkbox'
                  className='notice-check'
                  onChange={checkEach}
                  value={id}
                />
              </td>
              <td
                className='title'
                onClick={() => {
                  setModal(true);
                  setId(id);
                }}>
                {title}
              </td>
              <td>{created_at.split('T')[0]}</td>
              <td>{admin_name}</td>
              <td>{serviceCodeToString[service_code]}</td>
            </tr>
          </>
        );
      },
      <></>
    );
  };

  useEffect(() => {
    if (modal === false || editor === false) {
      getNoticeList();
    }
  }, [pageInfo.page, pageInfo.limit, modal, editor]);

  return (
    <div className='container'>
      <SideBar />
      <div className='content-wrap notice'>
        <div className='topBar'>
          <h2>NOTICE</h2>
          <div>
            <select
              value={pageInfo.limit}
              onChange={e => {
                setPageInfo(prev => {
                  const clone = { ...prev };
                  clone.page = 1;
                  clone.limit = e.target.value;
                  return clone;
                });
              }}>
              <option value='10'>10개씩 보기</option>
              <option value='30'>30개씩 보기</option>
              <option value='50'>50개씩 보기</option>
            </select>
            <button
              className='blueBtn'
              onClick={() => {
                setEditor(true);
                setId('');
              }}>
              글쓰기
            </button>
            <button onClick={() => multiDel()}>삭제</button>
          </div>
        </div>
        <div className='table-wrap'>
          <table>
            <colgroup>
              <col width='10%' />
              <col width='20%' />
            </colgroup>
            <thead>
              <tr>
                <th>
                  <input
                    type='checkbox'
                    className='notice-all-check'
                    onChange={checkAll}
                  />
                </th>
                <th>제목</th>
                <th>등록일</th>
                <th>작성자</th>
                <th>구분</th>
              </tr>
            </thead>
            <tbody>{renderTableBody()}</tbody>
          </table>
        </div>
        {pageInfo.totalPage === 1 ? (
          ''
        ) : (
          <Pagination pageInfo={pageInfo} setPageInfo={setPageInfo} />
        )}
      </div>
      {modal && (
        <NoticeDetail noticeId={id} setModal={setModal} setEditor={setEditor} />
      )}
      {editor && <NoticeWrite noticeId={id} setModal={setModal} setEditor={setEditor} />}
    </div>
  );
};

export default Notice;
