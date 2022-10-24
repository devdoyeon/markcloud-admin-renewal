import { useState } from 'react';
import SideBar from 'Components/SideBar';

const PopUp = () => {
  const [view, setView] = useState(10);
  const [due, setDue] = useState('all');

  return (
    <div className='container'>
      <SideBar />
      <div className='content-wrap popup'>
        <div className='topBar'>
          <h2>POP-UP</h2>
          <div>
            <select value={view} onChange={e => setView(e.target.value)}>
              <option value={10}>10개씩 보기</option>
              <option value={30}>30개씩 보기</option>
              <option value={50}>50개씩 보기</option>
            </select>
            <select value={due} onChange={e => setDue(e.target.value)}>
              <option value='all'>전체 보기</option>
              <option value='now'>현재 게시 중</option>
              <option value='end'>게시 종료</option>
            </select>
          </div>
        </div>
        <div className='table-wrap'>
          <table>
            <thead>
              <tr>
                <th>제목</th>
                <th>게시 날짜</th>
                <th>게시 만료일</th>
                <th>게시 상태</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
