import SideBar from 'Components/SideBar';

const Home = () => {
  return (
    <div className='container'>
      <SideBar />
      <div className='content-wrap dashboard'>
        <h2>DASHBOARD</h2>
        <div className='row'>
          <div>
            <h2>최근 업로드한 공지 사항</h2>
            <div className='table-wrap'>
              <table>
                <colgroup>
                  <col width='50%' />
                  <col width='20%' />
                  <col width='30%' />
                </colgroup>
                <thead>
                  <tr>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>공지 날짜</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>2</td>
                    <td>2</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>3</td>
                    <td>3</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>4</td>
                    <td>4</td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>5</td>
                    <td>5</td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>6</td>
                    <td>6</td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td>7</td>
                    <td>7</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h2>최근 업로드된 문의 사항</h2>
            <div className='table-wrap'>
              <table>
                <colgroup>
                  <col width='50%' />
                  <col width='20%' />
                  <col width='30%' />
                </colgroup>
                <thead>
                  <tr>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>문의 날짜</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>2</td>
                    <td>2</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>3</td>
                    <td>3</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>4</td>
                    <td>4</td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>5</td>
                    <td>5</td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>6</td>
                    <td>6</td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td>7</td>
                    <td>7</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className='row'>
          <div>
            <h2>회원 현황</h2>
            <div className='count-wrap column'>
              <div className='count'>12 / 30</div>
              <div>신규 / 전체</div>
            </div>
          </div>
          <div>
            <h2>텍스트 검색 현황</h2>
            <div className='count-wrap column'>
              <div className='count'>52 / 1563</div>
              <div>오늘 / 전체</div>
            </div>
          </div>
          <div>
            <h2>이미지 검색 현황</h2>
            <div className='count-wrap column'>
              <div className='count'>32 / 1020</div>
              <div>오늘 / 전체</div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div>
            <h2>텍스트 검색 순위</h2>
            <div className='table-wrap king'>
              <table>
                <colgroup>
                  <col width='15%' />
                  <col width='40%' />
                  <col width='30%' />
                  <col width='15%' />
                </colgroup>
                <thead>
                  <tr>
                    <th>순위</th>
                    <th>아이디</th>
                    <th>이름</th>
                    <th>검색횟수</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>2</td>
                    <td>2</td>
                    <td>2</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>3</td>
                    <td>3</td>
                    <td>3</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>4</td>
                    <td>4</td>
                    <td>4</td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>5</td>
                    <td>5</td>
                    <td>5</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h2>이미지 검색 순위</h2>
            <div className='table-wrap king'>
              <table>
                <colgroup>
                  <col width='15%' />
                  <col width='40%' />
                  <col width='30%' />
                  <col width='15%' />
                </colgroup>
                <thead>
                  <tr>
                    <th>순위</th>
                    <th>아이디</th>
                    <th>이름</th>
                    <th>검색횟수</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>2</td>
                    <td>2</td>
                    <td>2</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>3</td>
                    <td>3</td>
                    <td>3</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>4</td>
                    <td>4</td>
                    <td>4</td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>5</td>
                    <td>5</td>
                    <td>5</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
