import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Login';
import './App.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
        <Routes>
          <Route path="/" element={<Login/>}/>
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
