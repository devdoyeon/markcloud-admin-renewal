import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from 'Components/SideBar';
import Pagination from 'Components/Pagination';
import InquiryDetail from 'Components/InquiryDetail';
import CommonModal from 'Components/CommonModal';
import { catchError, changeState, maskingInfo } from 'JS/common';
import { getInquiryList, getServices } from 'JS/API';

const Inquiry = () => {
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    totalPage: 10,
    limit: 10,
  });
  const [select, setSelect] = useState('no_answer');
  const [id, setId] = useState('');
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const [list, setList] = useState([]);
  const [modal, setModal] = useState(false);
  const [serviceList, setServiceList] = useState({});
  const navigate = useNavigate();

  let prevent = false;

  //= 서비스 목록 불러오기
  const getServiceList = async () => {
    const result = await getServices();
    if (typeof result === 'object') setServiceList(result?.data?.data);
    else return catchError(result, navigate, setAlertBox, setAlert);
  };

  //= 문의 사항 불러오기
  const getInquiry = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getInquiryList(select, pageInfo.page, pageInfo.limit);
    if (typeof result === 'object') {
      setList(result?.data?.data);
      changeState(setPageInfo, 'totalPage', result?.data?.meta?.totalPage);
      getServiceList();
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  //= 문의 사항 테이블 렌더
  const renderTableBody = () => {
    return list.map(
      ({ title, created_at, user_name, status_flag, service_code, id }) => {
        return (
          <tr
            onClick={() => {
              setModal(true);
              setId(id);
            }}>
            <td className='title'>{title}</td>
            <td>{created_at.split('T')[0]}</td>
            <td>{maskingInfo('name', user_name)}</td>
            <td>{status_flag ? '완료' : '미답변'}</td>
            <td>{serviceList[service_code]}</td>
          </tr>
        );
      },
      <></>
    );
  };

  useEffect(() => {
    document.title = '마크클라우드 관리자 > 문의 사항 관리';
  }, []);

  useEffect(() => {
    if (!modal) getInquiry();
  }, [pageInfo.page, pageInfo.limit, select, modal]);

  return (
    <div className='container'>
      <SideBar />
      <div className='content-wrap inquiry'>
        <div className='topBar'>
          <h2>INQUIRY</h2>
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
              <option value={10}>10개씩 보기</option>
              <option value={30}>30개씩 보기</option>
              <option value={50}>50개씩 보기</option>
            </select>
            <select
              className='selectBox'
              value={select}
              onChange={e => {
                setSelect(e.target.value);
                changeState(setPageInfo, 'page', 1);
              }}>
              <option value='no_answer'>미답변 문의</option>
              <option value='answer'>답변 완료</option>
              <option value='all'>전체보기</option>
            </select>
          </div>
        </div>
        <div className='table-wrap'>
          {list?.length ? (
            <table>
              <colgroup>
                <col width='50%' />
                <col width='10%' />
                <col width='10%' />
                <col width='10%' />
                <col width='20%' />
              </colgroup>
              <thead>
                <tr>
                  <th>제목</th>
                  <th>등록일</th>
                  <th>작성자</th>
                  <th>상태</th>
                  <th>구분</th>
                </tr>
              </thead>
              <tbody>{renderTableBody()}</tbody>
            </table>
          ) : (
            <div className='none-list'>목록이 없습니다.</div>
          )}
        </div>
        <Pagination pageInfo={pageInfo} setPageInfo={setPageInfo} />
      </div>
      {modal ? <InquiryDetail inquiryId={id} setModal={setModal} /> : ''}
      {alertBox.bool && (
        <CommonModal
          setModal={setAlertBox}
          modal={alertBox}
          okFn={() => {
            if (alert === 'logout') navigate('/');
            else return;
          }}
        />
      )}
    </div>
  );
};

export default Inquiry;
