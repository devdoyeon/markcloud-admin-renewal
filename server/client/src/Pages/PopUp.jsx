import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from 'Components/SideBar';
import Pagination from 'Components/Pagination';
import PopupApplyModal from 'Components/PopupApplyModal';
import CommonModal from 'Components/CommonModal';
import {
  commonModalSetting,
  changeState,
  addZero,
  catchError,
} from 'JS/common';
import { getPopUpList, getServices } from 'JS/API';

const PopUp = () => {
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    totalPage: 10,
    limit: 10,
  });
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const [info, setInfo] = useState({
    id: '',
    img: '',
    link: '',
    start: '',
    end: '',
    service_code: '',
  });
  const [serviceList, setServiceList] = useState({});
  const [list, setList] = useState([]);
  const [due, setDue] = useState('all');
  const [mode, setMode] = useState('');
  const [modal, setModal] = useState(false);
  let prevent = false;
  const navigate = useNavigate();

  const returnDate = int => {
    const date = new Date(int * 1000);
    return `${date.getFullYear()}-${addZero(date.getMonth() + 1)}-${addZero(
      date.getDate()
    )} ${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
  };

  const returnStatus = (s, e) => {
    const now = new Date();
    const start = new Date(s);
    const end = new Date(e);
    if (now < start) return '게시 전';
    else if (start < now && now < end) return '게시 중';
    else if (end < now) return '게시 종료';
    else return '';
  };

  const getServiceList = async () => {
    const result = await getServices();
    if (typeof result === 'object') setServiceList(result?.data?.data);
    else catchError(result, navigate, setAlertBox, setAlert);
  };

  const getList = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getPopUpList(due, pageInfo);
    if (typeof result === 'object') {
      setList(result?.data?.data);
      setPageInfo(prev => {
        const clone = { ...prev };
        clone.totalPage = result?.data?.meta?.total_page;
        clone.limit = result?.data?.meta?.limit;
        return clone;
      });
      getServiceList();
    } else catchError(result, navigate, setAlertBox, setAlert);
  };

  const renderList = () => {
    return list?.reduce(
      (acc, { id, service_code, img_url, link_url, start_date, end_date }) => {
        return (
          <>
            {acc}
            <tr
              onClick={() => {
                setMode('edit');
                setModal(true);
                setInfo({
                  id: id,
                  img: img_url,
                  link: link_url,
                  start: start_date,
                  end: end_date,
                  service_code: service_code,
                });
              }}>
              <td>{serviceList[service_code]}</td>
              <td>
                <img src={`http://192.168.0.38:5555${img_url}`} alt='' />
              </td>
              <td>{link_url}</td>
              <td>{returnDate(start_date)}</td>
              <td>{returnDate(end_date)}</td>
              <td>
                {returnStatus(returnDate(start_date), returnDate(end_date))}
              </td>
            </tr>
          </>
        );
      },
      <></>
    );
  };

  useEffect(() => {
    document.title = '마크클라우드 관리자 > 팝업 관리';
  }, []);

  useEffect(() => {
    if (!modal) {
      setInfo({
        id: '',
        img: '',
        link: '',
        start: '',
        end: '',
        service_code: '',
      });
      getList();
    }
  }, [due, pageInfo.page, pageInfo.limit, modal]);

  return (
    <>
      <div className='container'>
        <SideBar />
        <div className='content-wrap popup'>
          <div className='topBar'>
            <h2>POP-UP</h2>
            <div>
              <select
                value={pageInfo.limit}
                onChange={e =>
                  changeState(setPageInfo, 'limit', e.target.value)
                }>
                <option value={10}>10개씩 보기</option>
                <option value={30}>30개씩 보기</option>
                <option value={50}>50개씩 보기</option>
              </select>
              <select value={due} onChange={e => setDue(e.target.value)}>
                <option value='all'>전체 보기</option>
                <option value='waiting'>게시 전</option>
                <option value='posting'>게시 중</option>
                <option value='expired'>게시 종료</option>
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
                <col width='10%' />
                <col width='30%' />
                <col width='20%' />
                <col width='15%' />
                <col width='15%' />
                <col width='10%' />
              </colgroup>
              <thead>
                <tr>
                  <th>서비스</th>
                  <th>미리보기</th>
                  <th>링크</th>
                  <th>게시 날짜</th>
                  <th>게시 만료일</th>
                  <th>게시 상태</th>
                </tr>
              </thead>
              <tbody>{renderList()}</tbody>
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
          okFn={() => {
            if (alert === 'logout') navigate('/');
            else return;
          }}
        />
      )}
    </>
  );
};

export default PopUp;
