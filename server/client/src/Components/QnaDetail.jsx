import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaWindowClose } from 'react-icons/fa';
import {
  BsFillQuestionCircleFill,
  BsExclamationCircleFill,
} from 'react-icons/bs';
import { getQnaDetail } from 'JS/API';
import { catchError } from 'JS/common';

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
      const { created_at, title, context, admin_name } = result?.data?.data;
      setInfo({
        created_at: created_at,
        title: title,
        context: context,
        admin_name: admin_name,
      });
      document.querySelector('.context').innerHTML = domParser.parseFromString(
        context,
        'text/html'
      ).body.innerHTML;
    } else return catchError(result, navigate, setAlertBox, setAlert);
  };

  useEffect(() => {
    if (!!id) getDetail();
  }, []);

  return (
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
          <div className='content-area'>{info?.title}</div>
          <hr />
          <div className='icon'>
            <BsExclamationCircleFill />
          </div>
          <div className='content-area'>{info?.context}</div>
        </div>
        <div className='btn-wrap'>
          <button>수정</button>
          <button>삭제</button>
        </div>
      </div>
    </div>
  );
};

export default QnaDetail;
