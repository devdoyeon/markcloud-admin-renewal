import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaWindowClose } from 'react-icons/fa';
import {
  BsFillQuestionCircleFill,
  BsExclamationCircleFill,
} from 'react-icons/bs';
import CommonModal from './CommonModal';
import {
  byteCount,
  catchError,
  changeState,
  commonModalSetting,
  maskingInfo,
  outClick,
} from 'JS/common';
import { getInquiryDetail, answerPost, answerEdit, answerDelete, getServices } from 'JS/API';

const InquiryDetail = ({ inquiryId, setModal }) => {
  let prevent = false;
  const [byte, setByte] = useState(0);
  const [alert, setAlert] = useState('');
  const [edit, setEdit] = useState(false);
  const [serviceList, setServiceList] = useState({})
  const [info, setInfo] = useState({
    service_code: '',
    user_name: '',
    created_at: '',
    title: '',
    context: '',
    status: false,
    answer: '',
  });
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const navigate = useNavigate();

  //= 서비스 목록 불러오기
  const getServiceList = async () => {
    const result = await getServices();
    if (typeof result === 'object') setServiceList(result?.data?.data);
    else return catchError(result, navigate, setAlertBox, setAlert);
  };
  //= 문의 사항 상세 내역 불러오기
  const getDetail = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getInquiryDetail(inquiryId);
    if (typeof result === 'object') {
      const {
        service_code,
        user_name,
        created_at,
        title,
        context,
        answer,
        status_flag,
      } = result?.data?.data;
      setInfo({
        service_code: service_code,
        user_name: user_name,
        created_at: created_at,
        title: title,
        context: context,
        status: status_flag,
        answer: answer,
      });
      getServiceList()
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  //= 답변 등록
  const applyAnswer = async () => {
    if (!info.answer)
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '답변을 작성해 주세요.'
      );
    const data = { answer: info.answer };
    const result = await answerPost(inquiryId, data);
    if (typeof result === 'object') {
      changeState(setInfo, 'status', true);
      getDetail();
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  //= 답변 수정
  const editAnswer = async () => {
    if (!info.answer)
      return commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '답변을 작성해 주세요.'
      );
    const data = { answer: info.answer, service_code: info.service_code };
    const result = await answerEdit(inquiryId, data);
    if (typeof result === 'object') {
      setEdit(false);
      getDetail();
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  //= 답변 삭제
  const delAnswer = async () => {
    const result = await answerDelete(inquiryId);
    if (typeof result === 'object') {
      setInfo(prev => {
        const clone = { ...prev };
        clone.status = false;
        clone.answer = '';
        return clone;
      });
      setAlert('deleteComplete');
      commonModalSetting(
        setAlertBox,
        true,
        'alert',
        '정상적으로 삭제되었습니다.'
      );
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  useEffect(() => {
    if (!alertBox.bool) {
      getDetail();
      window.addEventListener('click', e => outClick(e, setModal));
    }
  }, [alertBox.bool]);

  useEffect(() => {
    byteCount(info.answer, setInfo, setByte, 'answer', 3000);
  }, [info.answer]);

  return (
    <>
      <div className='modal-background'>
        <div className='modal inquiry-detail'>
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
                    <td>{maskingInfo('name', info.user_name)}</td>
                  </tr>
                  <tr>
                    <td>등록일자</td>
                    <td>{info.created_at.replace('T', ' ')}</td>
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
            <BsFillQuestionCircleFill />
            <h1>{info.title}</h1>
          </div>
          <div className='context'>{info.context}</div>
          {info.status ? (
            <div className='view-answer-wrap'>
              <div className='header'>
                <BsExclamationCircleFill />
                <h2>{edit ? '답변 수정' : '답변 내용'}</h2>
              </div>
              <div className='view-answer'>
                {edit ? (
                  <textarea
                    className='view-answer-area'
                    value={info.answer}
                    onChange={e =>
                      changeState(setInfo, 'answer', e.target.value)
                    }
                  />
                ) : (
                  <div className='view-answer-area'>{info.answer}</div>
                )}
                <div className='footer'>
                  <div className='viewBytes'>
                    <span>{byte}</span>/3000Bytes
                  </div>
                  <div>
                    {edit ? (
                      <>
                        <button onClick={editAnswer}>답변 완료</button>
                        <button
                          className='btn'
                          onClick={() => {
                            setAlert('edit');
                            commonModalSetting(
                              setAlertBox,
                              true,
                              'confirm',
                              '정말 취소하시겠습니까?<br/>지금까지 수정된 내용은 반영되지 않습니다.'
                            );
                          }}>
                          답변 취소
                        </button>
                      </>
                    ) : (
                      <button onClick={() => setEdit(true)}>답변 수정</button>
                    )}
                    <button
                      onClick={() => {
                        setAlert('delete');
                        commonModalSetting(
                          setAlertBox,
                          true,
                          'confirm',
                          '답변을 삭제하시면 다시 복구할 수 없습니다.<br/>답변을 삭제하시겠습니까?'
                        );
                      }}
                      className='btn'>
                      답변 삭제
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='answer-wrap'>
              <div className='header'>
                <BsExclamationCircleFill />
                <h2>답변 작성</h2>
              </div>
              <textarea
                className='answer-area'
                value={info.answer}
                onChange={e => changeState(setInfo, 'answer', e.target.value)}
              />
              <div className='footer'>
                <div className='viewBytes'>
                  <span>{byte}</span>/3000bytes
                </div>
                <button className='register-btn' onClick={applyAnswer}>
                  등록
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {alertBox.bool && (
        <CommonModal
          setModal={setAlertBox}
          modal={alertBox}
          okFn={() => {
            if (alert === 'edit') setEdit(false);
            else if (alert === 'deleteComplete') getDetail();
            else if (alert === 'logout') navigate('/');
            else delAnswer();
          }}
        />
      )}
    </>
  );
};

export default InquiryDetail;
