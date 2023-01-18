import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaWindowClose } from 'react-icons/fa';
import { TbDragDrop } from 'react-icons/tb';
import CommonModal from './CommonModal';
import {
  outClick,
  commonModalSetting,
  changeState,
  addZero,
  catchError,
  getKeyByValue,
} from 'JS/common';
import { getServices, createPopup, editPopup, deletePopup } from 'JS/API';

const PopupApplyModal = ({ setModal, mode, info, setInfo }) => {
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const [upload, setUpload] = useState(false);
  const [uploadImg, setUploadImg] = useState('');
  const [dragState, setDragState] = useState('leave');
  const [serviceList, setServiceList] = useState({});
  const date = new Date();
  const [activeDate, setActiveDate] = useState({
    start_date: `${date.getFullYear()}-${addZero(
      date.getMonth() + 1
    )}-${addZero(date.getDate())}`,
    start_time: '12:00',
    end_date: `${date.getFullYear()}-${addZero(date.getMonth() + 1)}-${addZero(
      date.getDate()
    )}`,
    end_time: '12:00',
  });
  let prevent = false;
  const navigate = useNavigate();

  const getServiceList = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getServices();
    if (typeof result === 'object') {
      setServiceList(result?.data?.data);
      if (mode === 'apply')
        changeState(
          setInfo,
          'service_code',
          Object.keys(result?.data?.data)[0]
        );
    } else catchError(result, navigate, setAlertBox, setAlert);
  };

  const newPopup = async () => {
    const result = await createPopup(info);
    if (typeof result === 'object') {
      setAlert('completeApply');
      commonModalSetting(setAlertBox, 'alert', true, '등록이 완료되었습니다.');
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  const modifyPopup = async () => {
    const result = await editPopup(info);
    if (typeof result === 'object') {
      setAlert('completeEdit');
      commonModalSetting(setAlertBox, 'alert', true, '수정이 완료되었습니다.');
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  const removePopup = async () => {
    const result = await deletePopup(info?.id);
    if (typeof result === 'object') {
      setAlert('completeDelete');
      commonModalSetting(setAlertBox, 'alert', true, '삭제가 완료되었습니다.');
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  useEffect(() => {
    window.addEventListener('click', e => outClick(e, setModal));
    getServiceList();
  }, []);

  const imgPreview = inputFile => {
    if (!inputFile) return; //파일 없을때 처리
    const reader = new FileReader();
    reader.onload = () => {
      setUploadImg(reader.result);
    };
    reader.readAsDataURL(inputFile[0]);
  };

  useEffect(() => {
    setInfo(prev => {
      const clone = { ...prev };
      clone.start = Math.floor(
        new Date(
          `${activeDate.start_date} ${activeDate.start_time}`
        ).getTime() / 1000
      );
      clone.end = Math.floor(
        new Date(`${activeDate.end_date} ${activeDate.end_time}`).getTime() /
          1000
      );
      return clone;
    });
  }, [activeDate]);

  useEffect(() => {
    if (mode === 'edit') {
      const start = new Date(info?.start * 1000);
      const end = new Date(info?.end * 1000);
      setActiveDate({
        start_date: `${start.getFullYear()}-${addZero(
          start?.getMonth() + 1
        )}-${addZero(start?.getDate())}`,
        start_time: `${addZero(start.getHours())}:${addZero(
          start.getMinutes()
        )}`,
        end_date: `${end.getFullYear()}-${addZero(
          end?.getMonth() + 1
        )}-${addZero(end?.getDate())}`,
        end_time: `${addZero(end.getHours())}:${addZero(end.getMinutes())}`,
      });
      setUpload(true);
      setUploadImg(`http://192.168.0.38:5555${info?.img}`);
    }
  }, []);

  return (
    <>
      <div className='modal-background'>
        <div className='modal applyPopup'>
          <div className='topBar'>
            <h2>{mode === 'apply' ? '팝업 등록' : '팝업 수정'}</h2>
            <div onClick={() => setModal(false)}>
              <FaWindowClose />
            </div>
          </div>
          <div className='column'>
            <input
              type='file'
              onChange={e => imgPreview(e.target.files)}
              accept='image/*'
            />
            {upload ? (
              <div className='imageInput'>
                <img src={uploadImg} alt='업로드된 이미지' />
              </div>
            ) : (
              <div
                className={`imageInput column ${dragState}`}
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  e.preventDefault();
                  const files = e.dataTransfer?.files;
                  if (files.length > 1)
                    return commonModalSetting(
                      setAlertBox,
                      true,
                      'alert',
                      '한 장만 업로드하실 수 있습니다.'
                    );
                  changeState(setInfo, 'img', files[0]);
                  imgPreview(files);
                  setDragState('leave');
                  setUpload(true);
                }}
                onDragEnter={() => setDragState('enter')}
                onDragLeave={() => setDragState('leave')}>
                <TbDragDrop />
                <span>이미지를 업로드해 주세요.</span>
              </div>
            )}
            <div className='row'>
              <span>서비스 구분</span>
              <select
                value={Number(info?.service_code)}
                onChange={e =>
                  changeState(setInfo, 'service_code', e.target.value)
                }>
                {Object.values(serviceList).map(service => {
                  return (
                    <option value={getKeyByValue(serviceList, service)}>
                      {service}
                    </option>
                  );
                }, <></>)}
              </select>
            </div>
            <div className='row'>
              <span>링크</span>
              <input
                type='text'
                placeholder='이미지와 함께 첨부할 URL을 입력해 주세요.'
                value={info?.link}
                onChange={e => changeState(setInfo, 'link', e.target.value)}
              />
            </div>
            <div className='row'>
              <span>팝업 게시일</span>
              <div className='dateInput row'>
                <input
                  type='date'
                  max='9999-12-31'
                  value={activeDate.start_date}
                  onChange={e =>
                    changeState(setActiveDate, 'start_date', e.target.value)
                  }
                />
                <input
                  type='time'
                  max='9999-12-31'
                  value={activeDate.start_time}
                  onChange={e =>
                    changeState(setActiveDate, 'start_time', e.target.value)
                  }
                />
              </div>
            </div>
            <div className='row'>
              <span>팝업 만료일</span>
              <div className='dateInput row'>
                <input
                  type='date'
                  value={activeDate.end_date}
                  onChange={e =>
                    changeState(setActiveDate, 'end_date', e.target.value)
                  }
                />
                <input
                  type='time'
                  value={activeDate.end_time}
                  onChange={e =>
                    changeState(setActiveDate, 'end_time', e.target.value)
                  }
                />
              </div>
            </div>
          </div>
          <div className='btnWrap row'>
            <button onClick={mode === 'edit' ? modifyPopup : newPopup}>
              {mode === 'edit' ? '수정' : '등록'}
            </button>
            {mode === 'edit' ? (
              <button
                onClick={() => {
                  setAlert('confirmDelete');
                  commonModalSetting(
                    setAlertBox,
                    true,
                    'confirm',
                    '팝업을 삭제하시겠습니까?<br/>삭제된 팝업은 복구할 수 없습니다.'
                  );
                }}>
                삭제
              </button>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
      {alertBox.bool && (
        <CommonModal
          setModal={setAlertBox}
          modal={alertBox}
          okFn={() => {
            if (
              alert === 'completeApply' ||
              alert === 'completeEdit' ||
              alert === 'completeDelete'
            )
              setModal(false);
            else if (alert === 'confirmDelete') removePopup();
            else if (alert === 'logout') navigate('/');
            else return;
          }}
        />
      )}
    </>
  );
};

export default PopupApplyModal;
