import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from 'Components/SideBar';
import Pagination from 'Components/Pagination';
import CommonModal from 'Components/CommonModal';
import { catchError, changeState } from 'JS/common';
import { getCouponList } from 'JS/API';
import { statusArr } from 'JS/array';

const Coupon = () => {
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    totalPage: 10,
    limit: 10,
  });
  const [list, setList] = useState([]);
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const navigate = useNavigate();
  let prevent = false;

  //= 쿠폰 발급 내역 불러오기
  const getList = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getCouponList(pageInfo.page, pageInfo.limit);
    if (typeof result === 'object') {
      setList(result?.data?.data);
      changeState(setPageInfo, 'totalPage', result?.data?.meta?.totalPage);
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  useEffect(() => {
    document.title = '마크클라우드 관리자 > 쿠폰 발급 내역';
  }, []);

  useEffect(() => {
    getList();
  }, [pageInfo.page, pageInfo.limit]);

  //= 쿠폰 발급 리스트 렌더
  const renderTableBody = () => {
    return list.map(
      ({
        event_uid,
        merchant_name,
        created_at,
        applied_at,
        expired_at,
        service_days,
        status,
      }) => {
        return (
          <tr>
            <td>{event_uid}</td>
            <td>{merchant_name}</td>
            <td>{created_at.replace('T', ' ')}</td>
            <td>{applied_at.replace('T', ' ')}</td>
            <td>{expired_at.replace('T', ' ')}</td>
            <td>{service_days}</td>
            <td>{statusArr[status]}</td>
          </tr>
        );
      },
      <></>
    );
  };
  return (
    <div className='container'>
      <SideBar />
      <div className='content-wrap event'>
        <div className='topBar'>
          <h2>EVENT</h2>
          <div>
            <select
              value={pageInfo.limit}
              onChange={e =>
                setPageInfo(prev => {
                  const clone = { ...prev };
                  clone.page = 1;
                  clone.limit = e.target.value;
                  return clone;
                })
              }>
              <option value={10}>10개씩 보기</option>
              <option value={30}>30개씩 보기</option>
              <option value={50}>50개씩 보기</option>
            </select>
          </div>
        </div>
        <div className='table-wrap'>
          {list?.length ? (
            <table>
              <thead>
                <tr>
                  <th>이벤트 코드</th>
                  <th>발급 쿠폰명</th>
                  <th>발급일</th>
                  <th>적용일</th>
                  <th>만료일</th>
                  <th>유효기간</th>
                  <th>상태</th>
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
          <Pagination setPageInfo={setPageInfo} pageInfo={pageInfo} />
        )}
      </div>
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

export default Coupon;
