import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import SideBar from 'Components/SideBar';
import Pagination from 'Components/Pagination';
import NoticeDetail from 'Components/NoticeDetail';
import NoticeWrite from 'Components/NoticeWrite';
import CommonModal from 'Components/CommonModal';
import { catchError, changeState, commonModalSetting } from 'JS/common';
import { getNoticeList, noticeMultiDelete } from 'JS/API';
import { serviceCodeToString } from 'JS/array';

const Notice = () => {
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    totalPage: 10,
    limit: 10,
  });
  const [id, setId] = useState('');
  const [modal, setModal] = useState(false);
  const [editor, setEditor] = useState(false);
  const [noticeList, setNoticeList] = useState([]);
  const [idArr, setIdArr] = useState([]);
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });

  let prevent = false;
  const navigate = useNavigate();

  const getNotice = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getNoticeList(pageInfo.page, pageInfo.limit);
    if (typeof result === 'object') {
      setNoticeList(result?.data?.data);
      changeState(setPageInfo, 'totalPage', result?.data?.meta?.totalPage);
    } else return catchError(result, navigate, setAlertBox);
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
    document.title = '마크클라우드 관리자 > 공지 사항 관리';
  }, []);

  useEffect(() => {
    if (!modal || !editor) getNotice();
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
            <button
              onClick={() => {
                if (!idArr.length)
                  return commonModalSetting(
                    setAlertBox,
                    true,
                    'alert',
                    '삭제할 글을 선택해 주세요.'
                  );
                commonModalSetting(
                  setAlertBox,
                  true,
                  'confirm',
                  '글을 삭제하면 다시 복구할 수 없습니다.<br/>정말 삭제하시겠습니까?'
                );
              }}>
              삭제
            </button>
          </div>
        </div>
        <div className='table-wrap'>
          <table>
            <colgroup>
              <col width='10%' />
              <col width='30%' />
              <col width='20%' />
              <col width='10%' />
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
      {editor && (
        <NoticeWrite noticeId={id} setModal={setModal} setEditor={setEditor} />
      )}
      {alertBox.bool && (
        <CommonModal
          setModal={setAlertBox}
          modal={alertBox}
          okFn={async () => {
            const data = { items: idArr };
            const result = await noticeMultiDelete(data);
            if (typeof result === 'object') {
              commonModalSetting(setAlertBox, true, 'alert', '삭제되었습니다.');
              $('.notice-all-check').prop('checked', false);
              $('.notice-check').prop('checked', false);
              changeState(setPageInfo, 'page', 1);
              setIdArr([]);
              getNotice();
            } else return catchError(result, navigate, setAlertBox);
          }}
          failFn={() => {
            $('.notice-all-check').prop('checked', false);
            $('.notice-check').prop('checked', false);
            return setIdArr([]);
          }}
        />
      )}
    </div>
  );
};

export default Notice;
