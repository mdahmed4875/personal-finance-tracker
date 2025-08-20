import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
  <>
  
      <Router>
      <Routes>
        <Route path="/" element={<SignupPage/>} />
        <Route path="dashboard" element={<Dashboard/>}/>
        <Route path="login" element={<LoginPage/>} />
      </Routes>
    </Router>
     <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default App
