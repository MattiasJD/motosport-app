import logo from './assets/logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
      <Router>
          <title>MotoSport</title>
            <link rel="icon" href={logo} />

          <Navbar/>
          <div className={"container mt-4"}>
              <Routes>
                  <Route path="/" element={<HomePage/>}/>
                  <Route path="/login" element={<LoginPage/>}/>
                  <Route path="/register" element={<RegisterPage/>}/>
                  <Route path="/admin" element={<AdminPage/>}/>
              </Routes>
          </div>
      </Router>
  );
}

export default App;
