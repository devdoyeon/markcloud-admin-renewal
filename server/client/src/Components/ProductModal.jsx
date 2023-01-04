import { useState, useEffect } from 'react';
import CommonModal from './CommonModal';
import { changeState, commonModalSetting, outClick } from 'JS/common';
import { getServices, applyMerchant, editMerchant } from 'JS/API';

const ProductModal = ({ setModal, mode, productInfo }) => {
  const [services, setServices] = useState([]);
  const [serviceInfo, setServiceInfo] = useState({});
  const [info, setInfo] = useState({
    id: 0,
    service_code: 100,
    merchant_code: '',
    merchant_name: '',
    merchant_price: '',
  });
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  let prevent = false;

  const serviceList = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getServices();
    if (typeof result === 'object') {
      setServices(Object.keys(result?.data?.data));
      setServiceInfo(result?.data?.data);
    }
  };

  const newMerchant = async () => {
    if (info.merchant_code.trim() === '')
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '상품 코드를 입력해 주세요.'
      );
    else if (info.merchant_name.trim() === '')
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '상품명을 입력해 주세요.'
      );
    else {
      const obj = { ...info };
      if (!obj.merchant_price) obj.merchant_price = '0';
      obj.merchant_price = obj.merchant_price.replaceAll(',', '');
      const result = await applyMerchant(obj);
      if (typeof result === 'object') {
        setInfo({
          id: 0,
          service_code: 100,
          merchant_code: '',
          merchant_name: '',
          merchant_price: '',
        });
        setModal(false);
      }
    }
  };

  const modifyMerchant = async () => {
    if (info.merchant_code.trim() === '')
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '상품 코드를 입력해 주세요.'
      );
    else if (info.merchant_name.trim() === '')
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '상품명을 입력해 주세요.'
      );
    else {
      const obj = { ...info };
      if (!obj.merchant_price) obj.merchant_price = '0';
      obj.merchant_price = obj.merchant_price.replaceAll(',', '');
      const result = await editMerchant(info?.id, obj);
      if (typeof result === 'object') {
        setInfo({
          id: 0,
          service_code: 100,
          merchant_code: '',
          merchant_name: '',
          merchant_price: '',
        });
        setModal(false);
      }
    }
  };

  useEffect(() => {
    if (mode === 'edit') {
      setInfo({ ...productInfo });
    }
  }, [mode]);

  useEffect(() => {
    window.addEventListener('click', e => outClick(e, setModal));
    serviceList();
  }, []);

  return (
    <>
      <div className='modal-background'>
        <div className='modal product'>
          <h2>{mode === 'apply' ? '신규 상품 등록' : '상품 수정'}</h2>
          <div className='column productInput'>
            <div className='row'>
              <span>서비스명</span>
              <select
                value={info.service_code}
                onChange={e =>
                  changeState(setInfo, 'service_code', e.target.value)
                }>
                {services.reduce((acc, service) => {
                  return (
                    <>
                      {acc}
                      <option value={service}>{serviceInfo[service]}</option>
                    </>
                  );
                }, <></>)}
              </select>
            </div>
            <div className='row'>
              <span>상품 코드</span>
              <input
                type='text'
                value={info.merchant_code}
                placeholder='상품 코드를 입력해 주세요.'
                onChange={e =>
                  changeState(setInfo, 'merchant_code', e.target.value)
                }
              />
            </div>
            <div className='row'>
              <span>상품명</span>
              <input
                type='text'
                value={info.merchant_name}
                placeholder='상품명을 입력해 주세요.'
                onChange={e =>
                  changeState(setInfo, 'merchant_name', e.target.value)
                }
              />
            </div>
            <div className='row'>
              <span>상품 가격</span>
              <input
                type='text'
                value={Number(
                  info.merchant_price.replaceAll(',', '')
                ).toLocaleString()}
                placeholder='상품 가격을 입력해 주세요.'
                onChange={e =>
                  changeState(setInfo, 'merchant_price', e.target.value)
                }
              />
            </div>
          </div>
          <div className='btn-wrap row'>
            <button onClick={mode === 'apply' ? newMerchant : modifyMerchant}>
              {mode === 'apply' ? '등록' : '수정'}
            </button>
            {mode === 'edit' ? <button>삭제</button> : ''}
            <button onClick={() => setModal(false)}>닫기</button>
          </div>
        </div>
      </div>
      {alertBox.bool && (
        <CommonModal
          setModal={setAlertBox}
          modal={alertBox}
          okFn={() => {}}
          failFn={() => {}}
        />
      )}
    </>
  );
};

export default ProductModal;
