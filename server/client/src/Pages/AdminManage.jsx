import $ from 'jquery';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import SideBar from 'Components/SideBar';
import CommonModal from 'Components/CommonModal';
import Pagination from 'Components/Pagination';
import AdminApplyModal from 'Components/AdminApplyModal';
import { adminMultiDelete, getAdmin, adminDelete } from 'JS/API';
import {
  enterFn,
  commonModalSetting,
  changeState,
  catchError,
  addHyphen,
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
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const [mode, setMode] = useState('');
  const [pkArr, setPkArr] = useState([]);
  const [pk, setPk] = useState(0);
  const [applyModal, setApplyModal] = useState(false);
  const [info, setInfo] = useState({
    user_id: '',
    name: '',
    password: '',
    email: '',
    gender: '',
    birthday: '',
    admin_role: 'super_admin',
    phone: '',
  });
  let prevent = false;
  const navigate = useNavigate();

  //= 관리자 불러오기
  const adminList = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getAdmin(pageInfo, select, searchTxt);
    if (typeof result === 'object') {
      setUser(result?.data?.data);
      changeState(setPageInfo, 'totalPage', result?.data?.meta?.totalPage);
    } else return catchError(result, navigate, setAlertBox);
  };

  //= 관리자 삭제
  const deleteAdmin = async () => {
    const result = await adminDelete(pk);
    if (typeof result === 'object') {
      setAlert('completeDelete');
      commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '정상적으로 삭제되었습니다.'
      );
      setPk(0);
    } else catchError(result, navigate, setAlertBox);
  };

  //= 관리자 다중 삭제
  const duplicateDelete = async () => {
    const result = await adminMultiDelete(pkArr);
    if (typeof result === 'object') {
      setAlert('completeDelete');
      commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '정상적으로 삭제되었습니다.'
      );
      setPkArr([]);
    } else catchError(result, navigate, setAlertBox);
  };

  //= 전체 체크
  const checkAll = () => {
    let arr = [];
    if ($('.admin-all-check').is(':checked')) {
      $('.admin-check').prop('checked', true);
      const all = $('.admin-check').length;
      for (let i = 0; i < all; i++) {
        const val = document.getElementsByClassName('admin-check')[i].value;
        arr.push(val);
        setPkArr(arr);
      }
    } else {
      $('.admin-check').prop('checked', false);
      setPkArr([]);
    }
  };

  const renderAdminList = () => {
    return user.reduce(
      (
        acc,
        {
          id,
          user_id,
          name,
          is_active,
          created_at,
          expired_at,
          gender,
          phone,
          birthday,
          email,
          admin_role,
        }
      ) => {
        //= 각자 체크
        const checkEach = () => {
          let all = $('.admin-check').length;
          let checked = $('.admin-check:checked').length;
          let arr = [];
          if (all !== checked) $('.admin-all-check').prop('checked', false);
          else $('.admin-all-check').prop('checked', true);
          for (let i = 0; i < all; i++) {
            if (document.getElementsByClassName('admin-check')[i].checked) {
              const val =
                document.getElementsByClassName('admin-check')[i].value;
              arr.push(val);
              setPkArr(arr);
            }
          }
        };

        //= 모달 데이터 바인딩
        const onModal = () => {
          if (!is_active)
            return commonModalSetting(
              setAlertBox,
              true,
              'alert',
              '삭제된 관리자는 수정하실 수 없습니다.'
            );
          setMode('edit');
          setApplyModal(true);
          setInfo({
            pk: id,
            user_id: user_id,
            name: name,
            password: 'samplePw',
            gender: gender,
            birthday: birthday,
            phone: addHyphen(phone),
            email: email,
            admin_role: admin_role,
          });
        };

        return (
          <>
            {acc}
            <tr>
              <td>
                {is_active ? (
                  <input
                    type='checkbox'
                    className='admin-check'
                    value={id}
                    onChange={checkEach}
                  />
                ) : (
                  ''
                )}
              </td>
              <td onClick={onModal}>{user_id}</td>
              <td onClick={onModal}>{name}</td>
              <td onClick={onModal}>
                {admin_role === 'super_admin' ? '최상위 관리자' : '관리자'}
              </td>
              <td onClick={onModal} className={is_active ? 'user' : 'resign'}>
                {is_active ? '회원' : '탈퇴'}
              </td>
              <td onClick={onModal}>{created_at}</td>
              <td onClick={onModal}>{is_active ? '' : expired_at}</td>
              <td>
                {is_active ? (
                  <button
                    className='deleteBtn'
                    onClick={() => {
                      setPk(id);
                      setAlert('confirmDelete');
                      commonModalSetting(
                        setAlertBox,
                        true,
                        'confirm',
                        '정말 삭제하시겠습니까?'
                      );
                    }}>
                    관리자 삭제
                  </button>
                ) : (
                  ''
                )}
              </td>
            </tr>
          </>
        );
      },
      <></>
    );
  };

  useEffect(() => {
    document.title = '마크클라우드 관리자 > 관리자 계정 관리';
    if (localStorage.getItem('admin_role') === 'admin') {
      setAlert('notAuthority');
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '접근 권한이 없습니다.'
      );
    }
    setSearchTxt('');
    if (!applyModal && select === 'all') {
      setInfo({
        user_id: '',
        name: '',
        password: '',
        email: '',
        gender: '',
        birthday: '',
        admin_role: 'super_admin',
        phone: '',
      });
      adminList();
    }
  }, [pageInfo.page, pageInfo.limit, applyModal, select]);

  return (
    <>
      <div className='container'>
        <SideBar />
        <div className='content-wrap adminManage'>
          <div className='topBar'>
            <h2>ADMIN</h2>
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
                <option value='uid'>아이디</option>
                <option value='name'>이름</option>
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
              <button
                className='searchBtn'
                onClick={() => {
                  if (select === 'all')
                    commonModalSetting(
                      setAlertBox,
                      true,
                      'alert',
                      '검색하실 검색어의 종류를 선택해 주세요.'
                    );
                  else if (searchTxt.trim() === '')
                    commonModalSetting(
                      setAlertBox,
                      true,
                      'alert',
                      '검색어를 입력해 주세요.'
                    );
                  adminList();
                }}>
                검색
                <span className='searchIcon'>
                  <FaSearch />
                </span>
              </button>
              <button
                className='deleteBtn'
                onClick={() => {
                  if (!pkArr.length)
                    return commonModalSetting(
                      setAlertBox,
                      true,
                      'alert',
                      '삭제할 대상을 선택해 주세요.'
                    );
                  else {
                    setAlert('confirmMultiDelete');
                    commonModalSetting(
                      setAlertBox,
                      true,
                      'confirm',
                      `${pkArr.length}명의 관리자를 정말 삭제하시겠습니까?<br/>삭제된 관리자는 복구할 수 없습니다.`
                    );
                  }
                }}>
                일괄 삭제
              </button>
              <button
                onClick={() => {
                  setMode('apply');
                  setApplyModal(true);
                }}>
                신규 관리자 등록
              </button>
            </div>
          </div>
          <div className='table-wrap'>
            <table>
              <colgroup>
                <col width='5%' />
                <col width='15%' />
                <col width='10%' />
                <col width='10%' />
                <col width='10%' />
                <col width='15%' />
                <col width='15%' />
                <col width='10%' />
              </colgroup>
              <thead>
                <tr>
                  <th>
                    <input
                      type='checkbox'
                      className='admin-all-check'
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
      {applyModal && (
        <AdminApplyModal
          setModal={setApplyModal}
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
            if (alert === 'confirmMultiDelete') duplicateDelete();
            else if (alert === 'completeDelete') adminList();
            else if (alert === 'confirmDelete') deleteAdmin();
            else if (alert === 'notAuthority') navigate('/home')
            else return;
          }}
          failFn={() => {}}
        />
      )}
    </>
  );
};

export default AdminManage;
