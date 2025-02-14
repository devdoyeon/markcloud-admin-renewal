import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaWindowClose, FaSlackHash } from 'react-icons/fa';
import {
  BsFillQuestionCircleFill,
  BsExclamationCircleFill,
} from 'react-icons/bs';
import CommonModal from './CommonModal';
import { deleteQna, getQnaDetail } from 'JS/API';
import { catchError, outClick, commonModalSetting, byteCount } from 'JS/common';

const QnaDetail = ({ id, setModal, setEditor }) => {
  const [info, setInfo] = useState({});
  const [byte, setByte] = useState({
    title: 0,
    context: 0,
  });
  const [alert, setAlert] = useState('');
  const [alertBox, setAlertBox] = useState({
    mode: '',
    context: '',
    bool: false,
  });
  const navigate = useNavigate();
  let prevent = false;
  const domParser = new DOMParser();

  //= 상세 내역 불러오기
  const getDetail = async () => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    const result = await getQnaDetail(id);
    if (typeof result === 'object') {
      const { created_at, title, context, admin_name, keyword } =
        result?.data?.data;
      setInfo({
        created_at: created_at,
        title: title,
        context: context,
        admin_name: admin_name,
        keyword: keyword,
      });
      document.querySelector('.qna-title').innerHTML =
        domParser.parseFromString(
          title?.replaceAll('\n', '<br />'),
          'text/html'
        ).body.innerHTML;
      document.querySelector('.qna-context').innerHTML =
        domParser.parseFromString(
          context?.replaceAll('\n', '<br />'),
          'text/html'
        ).body.innerHTML;
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  //= 삭제
  const delFn = async () => {
    const result = await deleteQna([id]);
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
    byteCount(info.title, setInfo, setByte, 'title', 3000);
  }, [info.title]);

  useEffect(() => {
    byteCount(info.context, setInfo, setByte, 'context', 3000);
  }, [info.context]);

  return (
    <>
      <div className='modal-background'>
        <div className='modal qna-detail'>
          <div className='topBar'>
            <div>
              <table>
                <tbody>
                  <tr>
                    <td>작성자</td>
                    <td>{info?.admin_name}</td>
                  </tr>
                  <tr>
                    <td>등록일자</td>
                    <td>{info?.created_at?.replaceAll('T', ' ')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div onClick={() => setModal(false)}>
              <FaWindowClose />
            </div>
          </div>
          <div className='column'>
            <div className='icon'>
              <BsFillQuestionCircleFill />
            </div>
            <div className='content-area qna-title'></div>
            <span className='byte'>
              <p>{byte.title}</p>/3000
            </span>
            <hr />
            <div className='icon'>
              <BsExclamationCircleFill />
            </div>
            <div className='content-area qna-context'></div>
            <span className='byte'>
              <p>{byte.context}</p>/3000
            </span>
            {info?.keyword ? (
              <div className='qna-keyword-list row'>
                {info?.keyword?.split('#')?.map(str => {
                  return str ? (
                    <span>
                      <FaSlackHash className='hashtagIcon' />
                      {str}
                    </span>
                  ) : (
                    <></>
                  );
                }, <></>)}
              </div>
            ) : (
              ''
            )}
          </div>
          <div className='btn-wrap'>
            <button
              onClick={() => {
                setEditor(true);
                setModal(false);
              }}>
              수정
            </button>
            <button
              onClick={() => {
                setAlert('deleteConfirm');
                commonModalSetting(
                  setAlertBox,
                  true,
                  'confirm',
                  `해당 Q&A를 삭제하시겠습니까?`
                );
              }}>
              삭제
            </button>
          </div>
        </div>
      </div>
      {alertBox.bool && (
        <CommonModal
          setModal={setAlertBox}
          modal={alertBox}
          okFn={() => {
            if (alert === 'deleteConfirm') delFn();
            else if (alert === 'completeDelete') setModal(false);
            else if (alert === 'logout') navigate('/');
            else return;
          }}
        />
      )}
    </>
  );
};

export default QnaDetail;
