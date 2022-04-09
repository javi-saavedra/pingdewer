import './App.css';
import './index.css'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import "antd/dist/antd.css";
import SignUp from './components/signUp'
import LogIn from './components/login'
import Home from './components/home'
import UserMap from './components/locations/userMap';
import MyPings from './components/pings';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/sign_up' element={<SignUp/>} />
        <Route path='/login' element={<LogIn />} />
        <Route path='/people' element={<UserMap />} />
        <Route path='/pings' element={<MyPings />} />
      </Routes>
    </Router>
  );
}

export default App;
