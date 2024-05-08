import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { Navbars } from './components/nav/nav';
import Request from './components/student/student';
import { Certificate } from './components/student/certificate';
import { Home } from './components/home/home';
import { Admin } from './components/admin/admin';

function App() {
  return (
    <>
      <Navbars />
      <BrowserRouter>
        <Routes>
          <Route path='/' Component={Home}/>
          <Route path='/student' Component={Request} />
          <Route path='/certificate' Component={Certificate}/>
          <Route path='/admin' Component={Admin}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
