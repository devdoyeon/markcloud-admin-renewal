import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import SideBar from 'Components/SideBar';
import CommonModal from 'Components/CommonModal';
import ProductModal from '../Components/ProductModal';
import { commonModalSetting, changeState, catchError } from 'JS/common';
import { getMerchant, productMultiDelete } from 'JS/API';

const Product = () => {
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    totalPage: 10,
    limit: 10,
  });
  const [modal, setModal] = useState(false);
  const [productArr, setProductArr] = useState([]);
  const [merchantArr, setMerchantArr] = useState([]);
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const [productInfo, setProductInfo] = useState({});
  const [mode, setMode] = useState('');
  let prevent = false;
  const navigate = useNavigate();

  const getProduct = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getMerchant();
    if (typeof result === 'object') setMerchantArr(result?.data?.data);
    else return catchError(result, navigate, setAlertBox);
  };

  const checkAll = () => {
    let arr = [];
    if ($('.product-all-check').is(':checked')) {
      $('.product-check').prop('checked', true);
      const all = $('.product-check').length;
      for (let i = 0; i < all; i++) {
        const val = document.getElementsByClassName('product-check')[i].value;
        arr.push(val);
        setProductArr(arr);
      }
    } else {
      $('.product-check').prop('checked', false);
      setProductArr([]);
    }
  };

  const deleteMultiple = async () => {
    const data = { items: productArr }; // 데이터
    const result = await productMultiDelete(data); // API 호출
    if (typeof result === 'object') {
      $('.product-all-check').prop('checked', false);
      $('.product-check').prop('checked', false);
      changeState(setPageInfo, 'page', 1); // 페이지 리셋
      setProductArr([]);
      getProduct(); // 상품 리스트 불러오기
      setAlert('completeDelete');
      commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '정상적으로 삭제되었습니다.'
      );
      return;
    } else return catchError(result, navigate, setAlertBox);
  };

  const renderTableBody = () => {
    const checkEach = () => {
      let all = $('.product-check').length;
      let checked = $('.product-check:checked').length;
      let arr = [];
      if (all !== checked) $('.product-all-check').prop('checked', false);
      else $('.product-all-check').prop('checked', true);
      for (let i = 0; i < all; i++) {
        if (document.getElementsByClassName('product-check')[i].checked) {
          const val = document.getElementsByClassName('product-check')[i].value;
          arr.push(val);
          setProductArr(arr);
        }
      }
    };
    return merchantArr.reduce(
      (
        acc,
        { id, service_code, merchant_code, merchant_name, merchant_price }
      ) => {
        const onModal = () => {
          setMode('edit');
          setProductInfo({
            id: id,
            service_code: service_code,
            merchant_code: merchant_code,
            merchant_name: merchant_name,
            merchant_price: merchant_price.toLocaleString(),
          });
          setModal(true);
        };
        return (
          <>
            {acc}
            <tr>
              <td>
                {' '}
                <input
                  type='checkbox'
                  className='product-check'
                  onChange={checkEach}
                  value={id}
                />
              </td>
              <td onClick={onModal}>{service_code}</td>
              <td onClick={onModal}>{merchant_code}</td>
              <td onClick={onModal}>{merchant_name}</td>
              <td onClick={onModal} className='price'>
                {merchant_price.toLocaleString()}원
              </td>
            </tr>
          </>
        );
      },
      <></>
    );
  };

  useEffect(() => {
    if (!modal) {
      document.title = '마크클라우드 관리자 > 상품 관리';
      if (localStorage.getItem('admin_role') === 'admin') {
        setAlert('notAuthority');
        return commonModalSetting(
          setAlertBox,
          true,
          'alert',
          '접근 권한이 없습니다.'
        );
      }
      getProduct();
    }
  }, [modal]);

  return (
    <>
      <div className='container'>
        <SideBar />
        <div className='content-wrap product'>
          <div className='topBar'>
            <h2>MERCHANT</h2>
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
                <option value='10'>10개씩 보기</option>
                <option value='30'>30개씩 보기</option>
                <option value='50'>50개씩 보기</option>
              </select>
              <button
                className='applyBtn'
                onClick={() => {
                  setMode('apply');
                  setModal(true);
                }}>
                등록
              </button>
              <button
                onClick={() => {
                  if (!productArr.length)
                    commonModalSetting(
                      setAlertBox,
                      true,
                      'alert',
                      '삭제하실 서비스를 선택해 주세요.'
                    );
                  else {
                    setAlert('multipleDelete');
                    commonModalSetting(
                      setAlertBox,
                      true,
                      'confirm',
                      '서비스를 삭제하면 다시 복구할 수 없습니다.<br/>정말 삭제하시겠습니까?'
                    );
                  }
                }}>
                일괄 삭제
              </button>
            </div>
          </div>
          <div className='table-wrap'>
            <table>
              <thead>
                <tr>
                  <th>
                    <input
                      type='checkbox'
                      className='product-all-check'
                      onChange={checkAll}
                    />
                  </th>
                  <th>서비스 코드</th>
                  <th>상품 코드</th>
                  <th>상품명</th>
                  <th>상품 가격</th>
                </tr>
              </thead>
              <tbody>{renderTableBody()}</tbody>
            </table>
          </div>
        </div>
      </div>
      {alertBox.bool && (
        <CommonModal
          setModal={setAlertBox}
          modal={alertBox}
          okFn={() => {
            if (alert === 'multipleDelete') deleteMultiple();
            else if (alert === 'completeDelete') setModal(false);
            else if (alert === 'notAuthority') navigate('/home')
            else return;
          }}
          failFn={() => {
            $('.product-all-check').prop('checked', false);
            $('.product-check').prop('checked', false);
            return setProductArr([]);
          }}
        />
      )}
      {modal && (
        <ProductModal
          setModal={setModal}
          mode={mode}
          productInfo={productInfo}
        />
      )}
    </>
  );
};

export default Product;
