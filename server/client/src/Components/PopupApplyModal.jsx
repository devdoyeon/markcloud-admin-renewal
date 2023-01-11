import { useState, useEffect } from 'react';
import { FaWindowClose } from 'react-icons/fa';
import { TbDragDrop } from 'react-icons/tb';
import CommonModal from './CommonModal';
import { outClick, commonModalSetting, changeState, addZero } from 'JS/common';

const PopupApplyModal = ({ setModal, mode, info, setInfo }) => {
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const [uploadImg, setUploadImg] = useState('');
  const [upload, setUpload] = useState(false);
  const [dragState, setDragState] = useState('leave');
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

  useEffect(() => {
    window.addEventListener('click', e => outClick(e, setModal));
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
                  value={activeDate.start_date}
                  onChange={e =>
                    changeState(setActiveDate, 'start_date', e.target.value)
                  }
                />
                <input
                  type='time'
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
            <button>{mode === 'edit' ? '수정' : '등록'}</button>
            {mode === 'edit' ? <button>삭제</button> : ''}
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

export default PopupApplyModal;
