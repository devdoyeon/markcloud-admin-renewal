import './App.css';
import { Routes, Route } from 'react-router-dom';
import SignIn from 'Pages/SignIn';
import Home from 'Pages/Home';
import Notice from 'Pages/Notice';
import Manage from 'Pages/Manage';
import Inquiry from 'Pages/Inquiry';
import Coupon from 'Pages/Coupon';
// import PopUp from 'Pages/PopUp';
import ErrorPage from 'Pages/ErrorPage';
import USACache from 'Pages/USACache';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/home' element={<Home />} />
        <Route path='/manage' element={<Manage />} />
        <Route path='/inquiry' element={<Inquiry />} />
        <Route path='/notice' element={<Notice />} />
        {/* <Route path='/popup' element={<PopUp />} /> */}
        <Route path='/event' element={<Coupon />} />
        <Route path='/usa-cache' element={<USACache />} />
        <Route path='*' element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
