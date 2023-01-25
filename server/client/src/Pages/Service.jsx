import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from 'Components/SideBar';
import ServiceModal from 'Components/ServiceModal';
import CommonModal from 'Components/CommonModal';
import { getServices } from 'JS/API';
import { catchError, commonModalSetting, getKeyByValue } from 'JS/common';

const Service = () => {
  const [mode, setMode] = useState('apply');
  const [modal, setModal] = useState(false);
  const [list, setList] = useState({});
  const [info, setInfo] = useState({
    service_code: '',
    service_name: '',
  });
  let prevent = false;
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const navigate = useNavigate();

  const serviceList = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getServices();
    if (typeof result === 'object') setList(result?.data?.data);
    else return catchError(result, navigate, setAlertBox, setAlert);
  };

  const renderServiceList = () => {
    return Object.values(list).map(service => {
      return (
        <div
          className='serviceBox'
          onClick={() => {
            setInfo({
              service_code: getKeyByValue(list, service),
              service_name: service,
            });
            setMode('edit');
            setModal(true);
          }}>
          <span>서비스 코드: {getKeyByValue(list, service)}</span>
          {service}
        </div>
      );
    }, <></>);
  };

  useEffect(() => {
    if (!modal) {
      document.title = '마크클라우드 관리자 > 서비스 관리';
      if (localStorage.getItem('admin_role') === 'admin') {
        setAlert('notAuthority');
        return commonModalSetting(
          setAlertBox,
          true,
          'alert',
          '접근 권한이 없습니다.'
        );
      }
      setInfo({
        service_code: '',
        service_name: '',
      });
      serviceList();
    }
  }, [modal]);

  return (
    <>
      <div className='container'>
        <SideBar />
        <div className='content-wrap service'>
          <div className='topBar'>
            <h2>SERVICE</h2>
            <button
              className='applyBtn'
              onClick={() => {
                setMode('apply');
                setModal(true);
              }}>
              등록
            </button>
          </div>
          {Object.values(list)?.length ? (
            <div className='service-wrap'>{renderServiceList()}</div>
          ) : (
            <div className='none-list service'>목록이 없습니다.</div>
          )}
        </div>
      </div>
      {modal ? (
        <ServiceModal
          mode={mode}
          setModal={setModal}
          info={info}
          setInfo={setInfo}
        />
      ) : (
        ''
      )}
      {alertBox.bool && (
        <CommonModal
          setModal={setAlertBox}
          modal={alertBox}
          okFn={() => {
            if (alert === 'notAuthority') return navigate('/home');
            else if (alert === 'logout') navigate('/');
            else return;
          }}
        />
      )}
    </>
  );
};

export default Service;
