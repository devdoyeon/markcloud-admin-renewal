import './App.css';
import { Routes, Route } from 'react-router-dom';
import SignIn from 'Pages/SignIn';
import Notice from 'Pages/Notice';
import Manage from 'Pages/Manage';
import Inquiry from 'Pages/Inquiry';
import Coupon from 'Pages/Coupon';
import InquiryDetail from 'Pages/Common/InquiryDetail';
import NoticeDetail from 'Pages/Common/NoticeDetail';
import NoticeWrite from 'Pages/Common/NoticeWrite';
import Home from 'Pages/Home';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/home' element={<Home/>}/>
        <Route path='/event' element={<Coupon />} />
        <Route path='/manage' element={<Manage />} />
        <Route path='/inquiry' element={<Inquiry />} />
        <Route path='/inquiry/:id' element={<InquiryDetail />} />
        <Route path='/notice' element={<Notice />} />
        <Route path='/notice/:id' element={<NoticeDetail />} />
        <Route path='/notice/write' element={<NoticeWrite />} />
      </Routes>
    </div>
  );
}

export default App;
