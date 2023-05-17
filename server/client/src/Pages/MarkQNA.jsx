import $ from 'jquery';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from 'Components/SideBar';
import QnaDetail from 'Components/QnaDetail';
import QnaWrite from 'Components/QnaWrite';
import CommonModal from 'Components/CommonModal';
import Pagination from 'Components/Pagination';
import { deleteQna, getQna } from 'JS/API';
import { catchError, commonModalSetting, changeState } from 'JS/common';

const MarkQNA = () => {
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    totalPage: 10,
    limit: 10,
  });
  const [qnaList, setQnaList] = useState([]);
  const [id, setId] = useState('');
  const [idArr, setIdArr] = useState([]);
  const [modal, setModal] = useState(false);
  const [editor, setEditor] = useState(false);
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });

  const navigate = useNavigate();
  let prevent = false;

  const dupleDeleteFn = async () => {
    const result = await deleteQna(idArr);
    if (typeof result === 'object') {
      $('.qna-all-check').prop('checked', false);
      $('.qna-check').prop('checked', false);
      changeState(setPageInfo, 'page', 1);
      setAlert('completeDelete');
      commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '정상적으로 삭제되었습니다.'
      );
      setIdArr([]);
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  //= 전체 선택
  const checkAll = () => {
    let arr = [];
    if ($('.qna-all-check').is(':checked')) {
      $('.qna-check').prop('checked', true);
      const all = $('.qna-check').length;
      for (let i = 0; i < all; i++) {
        const val = document.getElementsByClassName('qna-check')[i].value;
        arr.push(val);
        setIdArr(arr);
      }
    } else {
      $('.qna-check').prop('checked', false);
      setIdArr([]);
    }
  };

  //= 목록 렌더
  const renderQnaList = () => {
    return qnaList?.map(({ admin_name, created_at, id, title }) => {
      //& 개별 선택
      const checkEach = () => {
        let all = $('.qna-check').length;
        let checked = $('.qna-check:checked').length;
        let arr = [];
        if (all !== checked) $('.qna-all-check').prop('checked', false);
        else $('.qna-all-check').prop('checked', true);
        for (let i = 0; i < all; i++) {
          if (document.getElementsByClassName('qna-check')[i].checked) {
            const val = document.getElementsByClassName('qna-check')[i].value;
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
            {' '}
            <input
              type='checkbox'
              className='qna-check'
              onChange={checkEach}
              value={id}
            />
          </td>
          <td className='title' onClick={onModal}>
            {title}
          </td>
          <td onClick={onModal}>{created_at.split('T')[0]}</td>
          <td onClick={onModal}>{admin_name}</td>
        </tr>
      );
    }, <></>);
  };

  const getQnaList = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getQna(pageInfo);
    if (typeof result === 'object') {
      setQnaList(result?.data?.data);
      setPageInfo(prev => {
        const clone = { ...prev };
        clone.totalPage = result?.data?.meta?.total_page;
        return clone;
      });
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  useEffect(() => {
    if (!modal || !editor) getQnaList();
  }, [pageInfo.page, pageInfo.limit, modal, editor]);

  useEffect(() => {
    document.title = '마크클라우드 관리자 > 상표 Q&A 관리';
  }, [])

  const props = { id, setModal, setEditor };

  return (
    <>
      <div className='container'>
        <SideBar />
        <div className='content-wrap mark-qna'>
          <div className='topBar'>
            <h2>MARK Q&A</h2>
            <div>
              <select onChange={e => changeState(setPageInfo, 'limit', e.target.value)}>
                <option value='10'>10개씩 보기</option>
                <option value='30'>30개씩 보기</option>
                <option value='50'>50개씩 보기</option>
              </select>
              <button
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
            <table>
              <colgroup>
                <col width='10%' />
                <col width='70%' />
                <col width='10%' />
                <col width='10%' />
              </colgroup>
              <thead>
                <tr>
                  <th>
                    <input
                      type='checkbox'
                      className='qna-all-check'
                      onChange={checkAll}
                    />
                  </th>
                  <th>제목</th>
                  <th>등록일</th>
                  <th>작성자</th>
                </tr>
              </thead>
              <tbody>{renderQnaList()}</tbody>
            </table>
          </div>
          {pageInfo.totalPage === 1 ? (
            ''
          ) : (
            <Pagination pageInfo={pageInfo} setPageInfo={setPageInfo} />
          )}
        </div>
      </div>
      {modal && <QnaDetail {...props} />}
      {editor && <QnaWrite {...props} />}
      {alertBox.bool && (
        <CommonModal
          setModal={setAlertBox}
          modal={alertBox}
          okFn={() => {
            if (alert === 'deleteConfirm') dupleDeleteFn();
            else if (alert === 'completeDelete') getQnaList();
            else if (alert === 'logout') navigate('/');
            else return;
          }}
        />
      )}
    </>
  );
};

export default MarkQNA;
