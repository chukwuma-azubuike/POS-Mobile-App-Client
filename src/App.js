import { HashRouter, Routes, Route, BrowserRouter } from 'react-router-dom';
import './App.css';
import Login from './component/Login';
import Scan from './component/Scan';

function App() {
  return (
    // <HashRouter>
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Scan />} />
      </Routes>
    </BrowserRouter>
    // </HashRouter>
  );
}

export default App;
