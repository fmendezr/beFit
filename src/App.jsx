import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DBProvider } from './contexts/DBContext';
import { StorageProvider } from './contexts/StorageContext';
import Login from './components/Login';
import './App.css';
import SignUp from './components/SignUp';

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
        <DBProvider>
        <StorageProvider>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<SignUp/>}/>
        </Routes>
        </StorageProvider>
        </DBProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
