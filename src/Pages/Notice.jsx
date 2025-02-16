import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import SideBar from 'Components/SideBar';
import Pagination from 'Components/Pagination';
import NoticeDetail from 'Components/NoticeDetail';
import NoticeWrite from 'Components/NoticeWrite';
import CommonModal from 'Components/CommonModal';
import { catchError, changeState, commonModalSetting } from 'JS/common';
import { getNoticeList, noticeMultiDelete, getServices } from 'JS/API';

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
  const [alert, setAlert] = useState('');
  const [serviceList, setServiceList] = useState({});
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });

  let prevent = false;
  const navigate = useNavigate();

  //= 서비스 목록 불러오기
  const getServiceList = async () => {
    const result = await getServices();
    if (typeof result === 'object') setServiceList(result?.data?.data);
    else return catchError(result, navigate, setAlertBox, setAlert);
  };

  //= 공지사항 목록 불러오기
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
      getServiceList();
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  //= 공지사항 다중 삭제
  const deleteNotices = async () => {
    const data = { items: idArr };
    const result = await noticeMultiDelete(data);
    if (typeof result === 'object') {
      commonModalSetting(setAlertBox, true, 'alert', '삭제되었습니다.');
      $('.notice-all-check').prop('checked', false);
      $('.notice-check').prop('checked', false);
      changeState(setPageInfo, 'page', 1);
      setIdArr([]);
      setAlert('completeDelete');
      commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '정상적으로 삭제되었습니다.'
      );
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  //= 전체 선택
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

  //= 공지사항 목록 렌더
  const renderTableBody = () => {
    return noticeList.map(
      ({ title, created_at, service_code, id, admin_name }) => {
        //& 개별 선택
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

        //& 목록 클릭 시 실행할 함수
        const onModal = () => {
          setModal(true);
          setId(id);
        };

        return (
          <tr>
            <td>
              <input
                type='checkbox'
                className='notice-check'
                onChange={checkEach}
                value={id}
              />
            </td>
            <td className='title' onClick={onModal}>
              {title}
            </td>
            <td onClick={onModal}>{created_at.split('T')[0]}</td>
            <td onClick={onModal}>{admin_name}</td>
            <td onClick={onModal}>{serviceList[service_code]}</td>
          </tr>
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

  const props = { id, setModal, setEditor };

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
                else {
                  setAlert('deleteConfirm');
                  commonModalSetting(
                    setAlertBox,
                    true,
                    'confirm',
                    '글을 삭제하면 다시 복구할 수 없습니다.<br/>정말 삭제하시겠습니까?'
                  );
                }
              }}>
              삭제
            </button>
          </div>
        </div>
        <div className='table-wrap'>
          {noticeList?.length ? (
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
          ) : (
            <div className='none-list'>목록이 없습니다.</div>
          )}
        </div>
        {pageInfo.totalPage === 1 ? (
          ''
        ) : (
          <Pagination pageInfo={pageInfo} setPageInfo={setPageInfo} />
        )}
      </div>
      {modal && <NoticeDetail {...props} />}
      {editor && <NoticeWrite {...props} />}
      {alertBox.bool && (
        <CommonModal
          setModal={setAlertBox}
          modal={alertBox}
          okFn={() => {
            if (alert === 'deleteConfirm') deleteNotices();
            else if (alert === 'completeDelete') getNotice();
            else if (alert === 'logout') navigate('/');
            else return;
          }}
        />
      )}
    </div>
  );
};

export default Notice;
