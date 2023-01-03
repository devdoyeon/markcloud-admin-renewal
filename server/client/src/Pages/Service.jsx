import { useState, useEffect } from 'react';
import SideBar from 'Components/SideBar';
import ServiceModal from 'Components/ServiceModal';

const Service = () => {
  const [mode, setMode] = useState('apply');
  const [modal, setModal] = useState(false);
  const [info, setInfo] = useState({
    code: '',
    name: '',
  });

  const getKeyByValue = (obj, value) => {
    return Object.keys(obj).find(key => obj[key] === value);
  };

  const serviceObj = {
    100: 'MarkCloud',
    110: 'MarkView',
    120: 'MarkGroupWare',
    130: 'MarkLink',
  };

  const renderServiceList = () => {
    return Object.values(serviceObj).reduce((acc, service) => {
      return (
        <>
          {acc}
          <div
            className='serviceBox'
            onClick={() => {
              setInfo({
                code: getKeyByValue(serviceObj, service),
                name: service,
              });
              setMode('edit');
              setModal(true);
            }}>
            <span>서비스 코드: {getKeyByValue(serviceObj, service)}</span>
            {service}
          </div>
        </>
      );
    }, <></>);
  };

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
