import $ from 'jquery';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import SideBar from 'Components/SideBar';
import CommonModal from 'Components/CommonModal';
import Pagination from 'Components/Pagination';
import AdminApplyModal from 'Components/AdminApplyModal';
import { getUserList } from 'JS/API';
import {
  enterFn,
  commonModalSetting,
  changeState,
  catchError,
} from 'JS/common';

const AdminManage = () => {
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    totalPage: 10,
    limit: 10,
  });
  const [user, setUser] = useState([]);
  const [select, setSelect] = useState('all');
  const [searchTxt, setSearchTxt] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const [pk, setPk] = useState([]);
  const [applyModal, setApplyModal] = useState(false);
  let prevent = false;
  const navigate = useNavigate();

  const userList = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getUserList(pageInfo.page, pageInfo.limit);
    if (typeof result === 'object') {
      setUser(result?.data?.data);
      changeState(setPageInfo, 'totalPage', result?.data?.meta?.totalPage);
    } else return catchError(result, navigate, setAlertBox);
  };

  const checkAll = () => {
    let arr = [];
    if ($('.coupon-all-check').is(':checked')) {
      $('.coupon-check').prop('checked', true);
      const all = $('.coupon-check').length;
      for (let i = 0; i < all; i++) {
        const val = document.getElementsByClassName('coupon-check')[i].value;
        arr.push(val);
        setPk(arr);
      }
    } else {
      $('.coupon-check').prop('checked', false);
      setPk([]);
    }
  };

  const renderAdminList = () => {
    return user.reduce(
      (acc, { user_id, name, is_active, created_at, user_pk }) => {
        const checkEach = () => {
          let all = $('.coupon-check').length;
          let checked = $('.coupon-check:checked').length;
          let arr = [];
          if (all !== checked) $('.coupon-all-check').prop('checked', false);
          else $('.coupon-all-check').prop('checked', true);
          for (let i = 0; i < all; i++) {
            if (document.getElementsByClassName('coupon-check')[i].checked) {
              const val =
                document.getElementsByClassName('coupon-check')[i].value;
              arr.push(val);
              setPk(arr);
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
                  className='coupon-check'
                  value={user_pk}
                  onChange={checkEach}
                />
              </td>
              <td>{user_id}</td>
              <td>{name}</td>
              <td>관리자</td>
              <td className={is_active ? 'user' : 'resign'}>
                {is_active ? '회원' : '탈퇴'}
              </td>
              <td>{created_at.split('T')[0]}</td>
              <td>{is_active ? '' : '몰 랑'}</td>
              <td>
                <button className='deleteBtn'>관리자 삭제</button>
              </td>
            </tr>
          </>
        );
      },
      <></>
    );
  };

  useEffect(() => {
    userList();
  }, [pageInfo.page, pageInfo.limit]);

  return (
    <>
      <div className='container'>
        <SideBar />
        <div className='content-wrap adminManage'>
          <div className='topBar'>
            <h2>ADMIN MANAGE</h2>
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
                <option value='10'>10명씩 보기</option>
                <option value='30'>30명씩 보기</option>
                <option value='50'>50명씩 보기</option>
              </select>
              <select value={select} onChange={e => setSelect(e.target.value)}>
                <option value='all'>전체 보기</option>
                <option value='user_id'>아이디</option>
                <option value='username'>이름</option>
              </select>
              <input
                type='text'
                placeholder='검색어를 입력하세요.'
                value={searchTxt}
                onChange={e => setSearchTxt(e.target.value)}
                onKeyDown={e => {
                  if (!alertBox.bool) enterFn(e, () => {});
                }}
              />
              <button className='searchBtn' onClick={() => {}}>
                검색
                <span className='searchIcon'>
                  <FaSearch />
                </span>
              </button>
              <button
                className='deleteBtn'
                onClick={() => {
                  if (pk.length === 0)
                    return commonModalSetting(
                      setAlertBox,
                      true,
                      'alert',
                      '삭제할 대상을 선택해 주세요.'
                    );
                }}>
                일괄 삭제
              </button>
              <button onClick={() => setApplyModal(true)}>
                신규 관리자 등록
              </button>
            </div>
          </div>
          <div className='table-wrap'>
            <table>
              <colgroup>
                <col width='10%' />
                <col width='15%' />
                <col width='10%' />
                <col width='10%' />
                <col width='10%' />
                <col width='15%' />
                <col width='15%' />
                <col width='15%' />
              </colgroup>
              <thead>
                <tr>
                  <th>
                    <input
                      type='checkbox'
                      className='coupon-all-check'
                      onChange={checkAll}
                    />
                  </th>
                  <th>아이디</th>
                  <th>이름</th>
                  <th>권한</th>
                  <th>회원구분</th>
                  <th>가입일</th>
                  <th>탈퇴일</th>
                  <th>관리자 삭제</th>
                </tr>
              </thead>
              <tbody>{renderAdminList()}</tbody>
            </table>
          </div>
          <Pagination pageInfo={pageInfo} setPageInfo={setPageInfo} />
        </div>
      </div>
      {applyModal && <AdminApplyModal setModal={setApplyModal} />}
      {alertBox.bool && (
        <CommonModal setModal={setAlertBox} modal={alertBox} okFn={() => {}} />
      )}
    </>
  );
};

export default AdminManage;
