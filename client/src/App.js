import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { Admin } from './components/admin/admin';
import { Certificates } from './components/certificates/certificates';
import { Home } from './components/home/home';
import { Navbars } from './components/nav/nav';
import Request from './components/student/student';

function App() {
  return (
    <>
      <Navbars />
      <BrowserRouter>
        <Routes>
          <Route path='/' Component={Home}/>
          <Route path='/student' Component={Request} />
          <Route path='/admin' Component={Admin}/>
          <Route path='/certificates' Component={Certificates}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
