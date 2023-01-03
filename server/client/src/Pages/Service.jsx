import { useState, useEffect } from 'react';
import SideBar from 'Components/SideBar';
import ServiceModal from 'Components/ServiceModal';
import { getServices } from 'JS/API';

const Service = () => {
  const [mode, setMode] = useState('apply');
  const [modal, setModal] = useState(false);
  const [list, setList] = useState({});
  const [info, setInfo] = useState({
    service_code: '',
    service_name: '',
  });
  let prevent = false;

  const getKeyByValue = (obj, value) => {
    return Object.keys(obj).find(key => obj[key] === value);
  };

  const serviceList = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getServices();
    if (typeof result === 'object') setList(result?.data?.data);
  };

  const renderServiceList = () => {
    return Object.values(list).reduce((acc, service) => {
      return (
        <>
          {acc}
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
        </>
      );
    }, <></>);
  };

  useEffect(() => {
    if (!modal) serviceList();
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
          <div className='service-wrap'>{renderServiceList()}</div>
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
    </>
  );
};

export default Service;
