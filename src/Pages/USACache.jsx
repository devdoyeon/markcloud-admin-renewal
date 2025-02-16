import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from 'Components/SideBar';
import ViewCacheModal from 'Components/ViewCacheModal';
import CommonModal from 'Components/CommonModal';
import { commonModalSetting, catchError } from 'JS/common';
import {
  getCacheList,
  removeCacheJson,
  removeCache,
  getCacheSize,
} from 'JS/API';
import loading from 'Image/loading.gif';

const USACache = () => {
  const [key, setKey] = useState([]);
  const [value, setValue] = useState([]);
  const [arr, setArr] = useState([]);
  const [size, setSize] = useState('');
  const [modal, setModal] = useState(false);
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const navigate = useNavigate();

  let prevent = false;

  //= 캐시 사이즈 불러오기
  const getSize = async () => {
    const result = await getCacheSize();
    if (typeof result === 'object') setSize(result.data);
    else return catchError(result, navigate, setAlertBox, setAlert);
  };

  //= 캐시 목록 불러오기
  const getList = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 1000);
    setSize('');
    setKey([]);
    setValue([]);
    const result = await getCacheList();
    if (typeof result === 'object') {
      setKey(Object.keys(result.data));
      setValue(Object.values(result.data));
      getSize();
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  //= 캐시 삭제
  const removeCacheList = async mode => {
    let result;
    if (mode === 'json') result = await removeCacheJson();
    else result = await removeCache();
    if (typeof result === 'object') {
      commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '성공적으로 삭제되었습니다.'
      );
      getCacheList();
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  //= 캐시 목록 렌더
  const renderCacheList = () => {
    return key.map((code, idx) => {
      return (
        <tr>
          <td>{code}</td>
          <td
            className={Array.isArray(value[idx]) && 'arr'}
            onClick={() => {
              if (Array.isArray(value[idx])) {
                setModal(true);
                setArr(value[idx]);
              } else return;
            }}>
            {Array.isArray(value[idx]) ? '상세 보기' : value[idx]}
          </td>
        </tr>
      );
    }, <></>);
  };

  useEffect(() => {
    document.title = '마크클라우드 관리자 > 해외 데이터 캐시 관리';
    getList();
  }, []);

  return (
    <div className='container'>
      <SideBar />
      <div className='content-wrap usa-cache'>
        <div className='topBar'>
          <h2>CACHE</h2>
          <div>
            <span>
              총 캐시 사이즈: <span>{size}</span>
            </span>
            <button
              onClick={() => {
                setAlert('allDelete');
                commonModalSetting(
                  setAlertBox,
                  true,
                  'confirm',
                  '전체 캐시를 삭제하시겠습니까?<br/>삭제된 캐시는 복구할 수 없습니다.'
                );
              }}>
              전체 캐시 삭제
            </button>
            <button
              onClick={() => {
                setAlert('jsonDelete');
                commonModalSetting(
                  setAlertBox,
                  true,
                  'confirm',
                  'JSON을 삭제하시겠습니까?<br/>삭제된 파일은 복구할 수 없습니다.'
                );
              }}>
              JSON 삭제
            </button>
          </div>
        </div>
        <div className='table-wrap'>
          {size ? (
            key.length ? (
              <table>
                <colgroup>
                  <col width='80%' />
                  <col width='20%' />
                </colgroup>
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>{renderCacheList()}</tbody>
              </table>
            ) : (
              <div className='none-list'>캐시가 없습니다.</div>
            )
          ) : (
            <div className='loading'>
              <img src={loading} alt='로딩 아이콘' />
            </div>
          )}
        </div>
      </div>
      {modal && <ViewCacheModal arr={arr} setModal={setModal} />}
      {alertBox.bool && (
        <CommonModal
          setModal={setAlertBox}
          modal={alertBox}
          okFn={() => {
            if (alert === 'allDelete') removeCacheList('all');
            else if (alert === 'jsonDelete') removeCacheList('json');
            else if (alert === 'logout') navigate('/');
            else return;
          }}
        />
      )}
    </div>
  );
};

export default USACache;
