import './App.css';
import { Routes, Route } from 'react-router-dom';
import SignIn from 'Pages/SignIn';
import Notice from 'Pages/Notice';
import Manage from 'Pages/Manage';
import Inquiry from 'Pages/Inquiry';
import Coupon from 'Pages/Coupon';
import Home from 'Pages/Home';
import PopUp from 'Pages/PopUp';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/home' element={<Home />} />
        <Route path='/manage' element={<Manage />} />
        <Route path='/inquiry' element={<Inquiry />} />
        <Route path='/notice' element={<Notice />} />
        <Route path='/popup' element={<PopUp />} />
        <Route path='/event' element={<Coupon />} />
      </Routes>
    </div>
  );
}

export default App;
