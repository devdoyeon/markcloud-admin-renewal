import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import $ from 'jquery';
import SideBar from 'Components/SideBar';
import Pagination from 'Components/Pagination';
import AssignCouponModal from 'Components/AssignCouponModal';
import CommonModal from 'Components/CommonModal';
import PersonnelModal from 'Components/PersonnelModal';
import {
  catchError,
  changeState,
  commonModalSetting,
  enterFn,
  maskingInfo,
} from 'JS/common';
import { getUserList, searchUser } from 'JS/API';
import { statusArr } from 'JS/array';

const Manage = () => {
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    totalPage: 10,
    limit: 10,
  });
  const [searchTxt, setSearchTxt] = useState('');
  const [select, setSelect] = useState('all');
  const [couponModal, setCouponModal] = useState(false);
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const [info, setInfo] = useState({});
  const [editModal, setEditModal] = useState(false);
  const [user, setUser] = useState([]);
  const [pk, setPk] = useState([]);

  let prevent = false;
  const navigate = useNavigate();

  //= 회원 목록 불러오기
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
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  //= 회원 검색
  const userSearch = async () => {
    if (!searchTxt)
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '검색어를 입력해 주세요.'
      );
    if (select === 'all')
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '검색하실 종류를 선택해 주세요.'
      );
    const result = await searchUser(
      select,
      searchTxt,
      pageInfo.page,
      pageInfo.limit
    );
    if (typeof result === 'object') {
      setUser(result?.data?.data);
      setSelect('all');
      setSearchTxt('');
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  //= 전체 선택
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

  //= 회원 목록 테이블 렌더
  const renderUserList = () => {
    return user.map(
      ({
        user_pk,
        user_id,
        name,
        department,
        gender,
        voucher_name,
        voucher_status,
        event_name,
        event_status,
        created_at,
        is_active,
        birthday,
        phone,
        email,
      }) => {
        //& 쿠폰 발급 자격 확인
        const couponCheck = () => {
          if (is_active && event_status !== 'Applied') return true;
          else return false;
        };

        //& 개별 선택
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
        
        //& 목록 클릭 시 실행할 함수
        const onModal = () => {
          setInfo({
            id: maskingInfo('id', user_id),
            name: maskingInfo('name', name),
            department: department,
            gender: gender,
            birth: birthday,
            phone: maskingInfo(
              'phone',
              phone.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)
            ),
            email: maskingInfo('email', email),
          });
          setEditModal(true);
        };

        return (
          <tr>
            <td className='checkBoxArea'>
              {couponCheck() && (
                <input
                  type='checkbox'
                  className='coupon-check'
                  value={user_pk}
                  onChange={checkEach}
                />
              )}
            </td>
            <td onClick={onModal}>{maskingInfo('id', user_id)}</td>
            <td onClick={onModal}>{maskingInfo('name', name)}</td>
            <td onClick={onModal}>
              {department === 'none' ? '없음' : department}
            </td>
            <td onClick={onModal}>{voucher_name}</td>
            <td onClick={onModal}>{statusArr[voucher_status]}</td>
            <td onClick={onModal}>{event_name}</td>
            <td onClick={onModal}>{statusArr[event_status]}</td>
            <td onClick={onModal}>{created_at.split('T')[0]}</td>
            <td className={is_active ? 'user' : 'resign'} onClick={onModal}>
              {is_active ? '회원' : '탈퇴'}
            </td>
            <td>
              {couponCheck() ? (
                <button
                  className='couponBtn'
                  onClick={() => {
                    setCouponModal(true);
                    setPk(prev => {
                      const clone = [...prev];
                      clone.push(user_pk);
                      return clone;
                    });
                  }}>
                  쿠폰 발급
                </button>
              ) : (
                ''
              )}
            </td>
          </tr>
        );
      },
      <></>
    );
  };

  useEffect(() => {
    document.title = '마크클라우드 관리자 > 회원 관리';
  }, []);

  useEffect(() => {
    if (!couponModal) userList();
  }, [pageInfo.page, pageInfo.limit, couponModal]);

  return (
    <div className='container'>
      <SideBar />
      <div className='content-wrap manage'>
        <div className='topBar'>
          <h2>MEMBER</h2>
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
              <option value='department'>소속</option>
              <option value='voucher_name'>이용권 일수</option>
              <option value='voucher_status'>이용권 선택</option>
            </select>
            <input
              type='text'
              placeholder='검색어를 입력하세요.'
              value={searchTxt}
              onChange={e => setSearchTxt(e.target.value)}
              onKeyDown={e => {
                if (!alertBox.bool) enterFn(e, userSearch);
              }}
            />
            <button className='searchBtn' onClick={userSearch}>
              검색
              <span className='searchIcon'>
                <FaSearch />
              </span>
            </button>
            <button
              className='couponBtn'
              onClick={() => {
                if (pk.length === 0)
                  return commonModalSetting(
                    setAlertBox,
                    true,
                    'alert',
                    '쿠폰을 발급할 대상을 선택해 주세요.'
                  );
                setCouponModal(true);
              }}>
              쿠폰 일괄 발급
            </button>
          </div>
        </div>
        <div className='table-wrap'>
          <table>
            <colgroup>
              <col width='4%' />
              <col width='8%' />
              <col width='8%' />
              <col width='10%' />
              <col width='10%' />
              <col width='10%' />
              <col width='10%' />
              <col width='13%' />
              <col width='10%' />
              <col width='7%' />
              <col width='10%' />
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
                <th>소속</th>
                <th>이용권</th>
                <th>이용권 상태</th>
                <th>이벤트 쿠폰</th>
                <th>이벤트 쿠폰 상태</th>
                <th>가입일</th>
                <th>회원 구분</th>
                <th>쿠폰 발급</th>
              </tr>
            </thead>
            <tbody>{renderUserList()}</tbody>
          </table>
        </div>
        <Pagination pageInfo={pageInfo} setPageInfo={setPageInfo} />
      </div>
      {couponModal && (
        <AssignCouponModal
          setCouponModal={setCouponModal}
          pk={pk}
          setAlertBox={setAlertBox}
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
      {editModal && <PersonnelModal setEditModal={setEditModal} info={info} />}
    </div>
  );
};

export default Manage;
