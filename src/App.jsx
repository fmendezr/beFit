import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DBProvider } from './contexts/DBContext';
import { StorageProvider } from './contexts/StorageContext';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import './App.css';
import PrivateRoute from "./PrivateRoute";

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
          <Route path="/" element={<PrivateRoute><Home/></PrivateRoute>}/>
        </Routes>
        </StorageProvider>
        </DBProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
