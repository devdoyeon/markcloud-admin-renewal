import { useState, useEffect } from 'react';
import SideBar from 'Components/SideBar';
import { changeState, addZero } from 'JS/common';

const Statistic = () => {
  const [data, setData] = useState([]);
  const [arr, setArr] = useState([]);
  const [info, setInfo] = useState({
    period: 'year',
    subject: 'newJoin',
    selectChart: 'bar',
  });
  let prevent = false;

  const makeArr = type => {
    if (prevent) return;
    prevent = true;
    setTimeout(() => {
      prevent = false;
    }, 200);
    setArr([]);
    const date = new Date();
    if (type === 'year')
      for (let i = date.getFullYear() - 5; i <= date.getFullYear(); i++)
        setArr(prev => {
          const clone = [...prev];
          clone.push(i);
          return clone;
        });
    else if (type === 'month') {
      let monthArr = [];
      for (
        let i = date.getMonth() + 2 === 13 ? 1 : date.getMonth() + 2;
        i <= 12;
        i++
      ) {
        if (date.getMonth() + 1 === 12)
          monthArr.push(`${date.getFullYear()}.${addZero(i)}`);
        else monthArr.push(`${date.getFullYear() - 1}.${addZero(i)}`);
      }
      if (monthArr.length < 12) {
        for (let i = 1; i < 13 - monthArr.length; i++)
          monthArr.push(`${date.getFullYear()}.${addZero(i)}`);
      }
      setArr(monthArr);
    } else if (type === 'week') {
    }
  };

  useEffect(() => {
    makeArr('month');
  }, []);

  return (
    <div className='container'>
      <SideBar />
      <div className='content-wrap statistic'>
        <div className='topBar'>
          <h2>STATISTIC</h2>
          <div>
            <select
              value={info.period}
              onChange={e => changeState(setInfo, 'period', e.target.value)}>
              <option value='year'>연간</option>
              <option value='month'>월간</option>
              <option value='week'>주간</option>
              <option value='day'>일간</option>
            </select>
          </div>
        </div>
        <div className='section'>
          <ul className='row'>
            <li
              className={`subject ${
                info.subject === 'newJoin' ? 'active' : ''
              }`}
              onClick={() => changeState(setInfo, 'subject', 'newJoin')}>
              신규 가입
            </li>
            <li
              className={`subject ${
                info.subject === 'retired' ? 'active' : ''
              }`}
              onClick={() => changeState(setInfo, 'subject', 'retired')}>
              회원 탈퇴
            </li>
            <li
              className={`subject ${
                info.subject === 'textSearch' ? 'active' : ''
              }`}
              onClick={() => changeState(setInfo, 'subject', 'textSearch')}>
              텍스트 검색
            </li>
            <li
              className={`subject ${
                info.subject === 'imgSearch' ? 'active' : ''
              }`}
              onClick={() => changeState(setInfo, 'subject', 'imgSearch')}>
              이미지 검색
            </li>
            <li
              className={`subject ${
                info.subject === 'salesStatus' ? 'active' : ''
              }`}
              onClick={() => changeState(setInfo, 'subject', 'salesStatus')}>
              매출 현황
            </li>
          </ul>
          <ul className='column'>
            <li
              className={`selectChart ${
                info.selectChart === 'bar' ? 'active' : ''
              }`}
              onClick={() => changeState(setInfo, 'selectChart', 'bar')}>
              BAR
            </li>
            <li
              className={`selectChart ${
                info.selectChart === 'pie' ? 'active' : ''
              }`}
              onClick={() => changeState(setInfo, 'selectChart', 'pie')}>
              PIE
            </li>
            <li
              className={`selectChart ${
                info.selectChart === 'line' ? 'active' : ''
              }`}
              onClick={() => changeState(setInfo, 'selectChart', 'line')}>
              LINE
            </li>
          </ul>
          <div className='chart'></div>
        </div>
      </div>
    </div>
  );
};

export default Statistic;
