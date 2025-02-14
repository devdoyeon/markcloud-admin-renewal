import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BsFillQuestionCircleFill,
  BsExclamationCircleFill,
} from 'react-icons/bs';
import { FaWindowClose, FaSlackHash } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import CommonModal from './CommonModal';
import {
  changeState,
  commonModalSetting,
  catchError,
  byteCount,
  enterFn,
} from 'JS/common';
import { editQna, getQnaDetail, newQna } from 'JS/API';

const QnaWrite = ({ id, setModal, setEditor }) => {
  const [postInfo, setPostInfo] = useState({
    title: '',
    context: '',
  });
  const [alert, setAlert] = useState('');
  const [mode, setMode] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const [keyword, setKeyword] = useState('');
  const [keywordArr, setKeywordArr] = useState([]);
  const [byte, setByte] = useState({
    title: 0,
    context: 0,
  });

  const navigate = useNavigate();
  let prevent = false;

  //= 수정일 때 기존 내용 불러오기
  const getDetail = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getQnaDetail(id);
    if (typeof result === 'object') {
      const { title, context, keyword } = result?.data?.data;
      setPostInfo({
        title: title,
        context: context,
      });
      const arr = keyword?.split('#');
      arr.shift();
      setKeywordArr(arr);
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  //= Q&A 등록
  const postQna = async () => {
    if (!postInfo.title && !postInfo.context) {
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '제목과 내용을 입력해 주세요.'
      );
    } else if (!postInfo.title) {
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '제목을 입력해 주세요.'
      );
    } else if (!postInfo.context) {
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '내용을 입력해 주세요.'
      );
    } else {
      const query = { ...postInfo };
      if (keywordArr.length) {
        let str = '';
        keywordArr.forEach(word => {
          str += `#${word}`;
        });
        query.keyword = str;
      }
      const result = await newQna(query);
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

  //= Q&A 수정
  const editFn = async () => {
    const data = { ...postInfo };
    if (keywordArr.length) {
      let str = '';
      keywordArr.forEach(word => {
        str += `#${word}`;
      });
      data.keyword = str;
    }
    const result = await editQna(id, data);
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

  useEffect(() => {
    if (!!id) {
      setMode('edit');
      getDetail();
    } else {
      setMode('write');
    }
  }, []);

  useEffect(() => {
    byteCount(postInfo.title, setPostInfo, setByte, 'title', 3000);
  }, [postInfo.title]);

  useEffect(() => {
    byteCount(postInfo.context, setPostInfo, setByte, 'context', 3000);
  }, [postInfo.context]);

  return (
    <>
      <div className='modal-background'>
        <div className='modal qna-write'>
          <div className='topBar'>
            <span></span>
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
          <div className='column'>
            <div className='icon'>
              <BsFillQuestionCircleFill />
            </div>
            <textarea
              placeholder='질문을 입력해 주세요.'
              value={postInfo.title}
              onChange={e => {
                changeState(setPostInfo, 'title', e.target.value);
              }}
            />
            <span className='byte'>
              <p>{byte.title}</p>/3000
            </span>
            <hr />
            <div className='icon'>
              <BsExclamationCircleFill />
            </div>
            <textarea
              placeholder='답변을 입력해 주세요.'
              value={postInfo.context}
              onChange={e =>
                changeState(setPostInfo, 'context', e.target.value)
              }
            />
            <span className='byte'>
              <p>{byte.context}</p>/3000
            </span>
            <div className='row qna-keyword-list'>
              {keywordArr?.map(keyword => {
                return (
                  <span>
                    <FaSlackHash className='hashtagIcon' />
                    {keyword}
                    <IoClose
                      className='closeIcon'
                      onClick={() =>
                        setKeywordArr(prev => {
                          const clone = [...prev];
                          clone.splice(clone.indexOf(keyword), 1);
                          return clone;
                        })
                      }
                    />
                  </span>
                );
              }, <></>)}
            </div>
            <div className='row qna-keyword-input-wrap'>
              <input
                type='text'
                className='qna-keyword-input'
                placeholder='해시태그를 입력해 주세요.'
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                onKeyDown={e =>
                  enterFn(e, () => {
                    if (e.target.value) {
                      setKeywordArr(prev => {
                        const clone = [...prev];
                        clone.push(e.target.value);
                        return clone;
                      });
                      setKeyword('');
                    }
                  })
                }
              />
              <button
                className='applyBtn'
                onClick={() => {
                  if (keyword) {
                    setKeywordArr(prev => {
                      const clone = [...prev];
                      clone.push(keyword);
                      return clone;
                    });
                    setKeyword('');
                  }
                }}>
                등록
              </button>
            </div>
          </div>
          <div className='btn-wrap'>
            <button onClick={() => (id ? editFn() : postQna())}>
              {id ? '수정' : '등록'}
            </button>
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

export default QnaWrite;
