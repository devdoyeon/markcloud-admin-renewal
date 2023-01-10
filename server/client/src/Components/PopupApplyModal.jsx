import { useState, useEffect } from 'react';
import { FaWindowClose } from 'react-icons/fa';
import { TbDragDrop } from 'react-icons/tb';
import CommonModal from './CommonModal';
import { outClick, commonModalSetting } from 'JS/common';

const PopupApplyModal = ({ setModal, mode, info, setInfo }) => {
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const [uploadImg, setUploadImg] = useState('');
  const [upload, setUpload] = useState(false);
  const [dragState, setDragState] = useState('leave');

  useEffect(() => {
    window.addEventListener('click', e => outClick(e, setModal));
  });

  const imgPreview = inputFile => {
    if (!inputFile) return; //파일 없을때 처리
    console.log(inputFile);
    const reader = new FileReader();
    reader.onload = () => {
      setUploadImg(reader.result);
    };
    reader.readAsDataURL(inputFile[0]);
  };

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
              />
            </div>
            <div className='row'>
              <span>팝업 게시일</span>
              <div className='dateInput row'>
                <input type='date' />
                <input type='time' />
              </div>
            </div>
            <div className='row'>
              <span>팝업 만료일</span>
              <div className='dateInput row'>
                <input type='date' />
                <input type='time' />
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
