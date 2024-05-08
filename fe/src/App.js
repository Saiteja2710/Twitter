import './App.css';
import Login from './pages/login.js';
import Profile from './pages/profile.js';
import SignIn from './pages/register';
import Sidebar from './pages/sidebar.js';
import Welcome from './pages/welcome.js';
import TweetBox from './Tweetbox.js';

// import Car from './card.js'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/welcome' element={<Welcome />} />
          <Route path='/feed' element={<TweetBox />} />
          <Route path='/register' element={<SignIn />} />
          <Route path='/' element={<Login />} />
          <Route path='/sidebar' element={<Sidebar />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </BrowserRouter>


    </div>
  );
}

export default App;
