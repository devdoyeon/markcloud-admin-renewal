import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaWindowClose } from 'react-icons/fa';
import { AiFillNotification } from 'react-icons/ai';
import CommonModal from './CommonModal';
import { byteCount, catchError, commonModalSetting, outClick } from 'JS/common';
import { getNoticeDetail, noticeDelete, getServices } from 'JS/API';

const NoticeDetail = ({ noticeId, setModal, setEditor }) => {
  const [info, setInfo] = useState({
    service_code: '',
    created_at: '',
    title: '',
    context: '',
    admin_name: '',
  });
  const [byte, setByte] = useState({
    title: 0,
    context: 0,
  });
  const [serviceList, setServiceList] = useState({})
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const navigate = useNavigate();
  let prevent = false;
  const domParser = new DOMParser();

  const getServiceList = async () => {
    const result = await getServices();
    if (typeof result === 'object') setServiceList(result?.data?.data);
    else return catchError(result, navigate, setAlertBox, setAlert);
  };

  const getDetail = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getNoticeDetail(noticeId);
    if (typeof result === 'object') {
      const { service_code, created_at, title, context, admin_name } =
        result?.data?.data;
      setInfo({
        service_code: service_code,
        created_at: created_at,
        title: title,
        context: context,
        admin_name: admin_name,
      });
      const { data } = result?.data;
      document.querySelector('.context').innerHTML = domParser.parseFromString(
        data?.context,
        'text/html'
      ).body.innerHTML;
      getServiceList()
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  const delNotice = async () => {
    const result = await noticeDelete(noticeId);
    if (typeof result === 'object') {
      setAlert('completeDelete');
      commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '정상적으로 삭제되었습니다.'
      );
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  useEffect(() => {
    getDetail();
    window.addEventListener('click', e => outClick(e, setModal));
  }, []);

  useEffect(() => {
    byteCount(info.context, setInfo, setByte, 'context', 3000);
  }, [info.context]);

  useEffect(() => {
    byteCount(info.title, setInfo, setByte, 'title', 300);
  }, [info.title]);
  return (
    <>
      <div className='modal-background'>
        <div className='modal notice'>
          <div className='topBar'>
            <div>
              <table>
                <thead>
                  <tr>
                    <th>서비스 구분</th>
                    <th>{serviceList[info.service_code]}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>작성자</td>
                    <td>{info.admin_name}</td>
                  </tr>
                  <tr>
                    <td>등록일자</td>
                    <td>{info.created_at.replaceAll('T', ' ')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div onClick={() => setModal(false)}>
              <FaWindowClose />
            </div>
          </div>
          <hr />
          <div className='title-wrap'>
            <AiFillNotification />
            <h1>{info.title}</h1>
          </div>
          <div className='context'></div>
          <div className='footer'>
            <div className='viewBytes'>
              <span>{byte.context} / 3000</span>
            </div>
            <div>
              <button
                onClick={() => {
                  setEditor(true);
                  setModal(false);
                }}>
                수정
              </button>
              <button
                className='btn'
                onClick={() => {
                  setAlert('deleteConfirm');
                  commonModalSetting(
                    setAlertBox,
                    true,
                    'confirm',
                    '해당 공지를 삭제하시겠습니까?'
                  );
                }}>
                삭제
              </button>
            </div>
          </div>
          <div className='go-service'>
            <a
              href={`https://markcloud.co.kr/mark-notice/${noticeId}`}
              target='_blank'
              rel='noopener noreferrer'>
              실제 업로드된 모습 확인하기 &#62;&#62;
            </a>
          </div>
        </div>
      </div>
      {alertBox.bool && (
        <CommonModal
          setModal={setAlertBox}
          modal={alertBox}
          okFn={() => {
            if (alert === 'deleteConfirm') delNotice();
            else if (alert === 'completeDelete') setModal(false);
            else if (alert === 'logout') navigate('/');
            else return;
          }}
        />
      )}
    </>
  );
};

export default NoticeDetail;
