import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaWindowClose } from 'react-icons/fa';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CommonModal from './CommonModal';
import {
  catchError,
  byteCount,
  changeState,
  commonModalSetting,
  getKeyByValue,
} from 'JS/common';
import { getNoticeDetail, noticeEdit, noticeWrite, getServices } from 'JS/API';

const NoticeWrite = ({ noticeId, setModal, setEditor }) => {
  const [info, setInfo] = useState({
    service_code: '',
    title: '',
    context: '',
  });
  const [byte, setByte] = useState({
    title: 0,
    context: 0,
  });
  const [services, setServices] = useState({});
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const [mode, setMode] = useState('');
  const navigate = useNavigate();

  let prevent = false;

  //= 서비스 목록 불러오기
  const getServiceList = async () => {
    const result = await getServices();
    if (typeof result === 'object') setServices(result?.data?.data);
    else return catchError(result, navigate, setAlertBox, setAlert);
  };

  //= 서비스 옵션 렌더
  const renderServiceList = () => {
    return Object.values(services).reduce((acc, service) => {
      return (
        <>
          {acc}
          <option value={getKeyByValue(services, service)}>{service}</option>
        </>
      );
    }, <></>);
  };

  //= 수정일 때 기존 공지사항 불러오기
  const getDetail = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getNoticeDetail(noticeId);
    if (typeof result === 'object') {
      const { title, context, service_code } = result?.data?.data;
      setInfo({
        title: title,
        service_code: service_code,
        context: context,
      });
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  //= 공지사항 수정
  const editNotice = async () => {
    const data = {
      service_code: info.service_code,
      title: info.title,
      context: info.context,
    };
    const result = await noticeEdit(noticeId, data);
    if (typeof result === 'object') {
      setAlert('completeEdit');
      commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '성공적으로 수정 되었습니다.'
      );
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  //= 공지사항 등록
  const writeNotice = async () => {
    if (!info.title && !info.context) {
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '제목과 내용을 입력해 주세요.'
      );
    } else if (!info.title) {
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '제목을 입력해 주세요.'
      );
    } else if (!info.context) {
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '내용을 입력해 주세요.'
      );
    } else {
      const result = await noticeWrite(info);
      if (typeof result === 'object') {
        setAlert('completeApply');
        commonModalSetting(
          setAlertBox,
          true,
          'alert',
          '성공적으로 등록 되었습니다.'
        );
      } else return catchError(result, navigate, setAlertBox, setAlert);
    }
  };

  useEffect(() => {
    if (!!noticeId) {
      setMode('edit');
      getDetail();
    } else {
      setMode('write');
      changeState(setInfo, 'service_code', 100);
      getServiceList();
    }
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
        <div className='modal editor'>
          <div className='topBar'>
            <div>
              {mode === 'write' && (
                <select
                  value={info.service_code}
                  onChange={e =>
                    changeState(setInfo, 'service_code', Number(e.target.value))
                  }>
                  {renderServiceList()}
                </select>
              )}
              <input
                type='text'
                value={info.title}
                onChange={e => changeState(setInfo, 'title', e.target.value)}
              />
              <div className='viewBytes'>
                <span>{byte.title}</span>/300
              </div>
            </div>
            <div
              onClick={() => {
                setAlert('confirmCancel');
                commonModalSetting(
                  setAlertBox,
                  true,
                  'confirm',
                  `정말 취소하시겠습니까?<br />지금까지 ${
                    mode === 'edit' ? '수정' : '작성'
                  }된 내용은 반영되지 않습니다.`
                );
              }}>
              <FaWindowClose />
            </div>
          </div>
          <hr />
          <CKEditor
            editor={ClassicEditor}
            data={info.context}
            onChange={(e, editor) =>
              changeState(setInfo, 'context', editor.getData())
            }
          />
          <div className='footer'>
            <div className='viewBytes'>
              <span>{byte.context}</span>/3000
            </div>
            <div>
              <button
                onClick={() => {
                  setAlert('confirmCancel');
                  commonModalSetting(
                    setAlertBox,
                    true,
                    'confirm',
                    `정말 취소하시겠습니까?<br />지금까지 ${
                      mode === 'edit' ? '수정' : '작성'
                    }된 내용은 반영되지 않습니다.`
                  );
                }}>
                취소
              </button>
              <button
                onClick={() => {
                  if (noticeId) editNotice();
                  else writeNotice();
                }}>
                완료
              </button>
            </div>
          </div>
        </div>
      </div>
      {alertBox.bool && (
        <CommonModal
          setModal={setAlertBox}
          modal={alertBox}
          okFn={() => {
            if (
              alert === 'completeEdit' ||
              (alert === 'confirmCancel' && mode === 'edit')
            ) {
              setEditor(false);
              setModal(true);
            } else if (
              alert === 'completeApply' ||
              (alert === 'confirmCancel' && mode === 'write')
            )
              setEditor(false);
            else if (alert === 'logout') navigate('/');
            else return;
          }}
        />
      )}
    </>
  );
};

export default NoticeWrite;
