import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DBProvider } from './contexts/DBContext';
import { StorageProvider } from './contexts/StorageContext';
import { Container } from 'react-bootstrap';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import Camera from './components/Camera';
import PrivateRoute from "./PrivateRoute";
//import './App.css';

function App() {
  return (
    <Container className='d-flex align-items-center justify-content-center' style={{minHeight: "100vh"}}>
      <BrowserRouter>
        <AuthProvider>
        <DBProvider>
        <StorageProvider>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/" element={<PrivateRoute><Home/></PrivateRoute>}/>
          <Route path="/:displayName" element={<PrivateRoute><UserProfile/></PrivateRoute>}/>
          <Route path="/camera" element={<PrivateRoute><Camera/></PrivateRoute>} />
        </Routes>
        </StorageProvider>
        </DBProvider>
        </AuthProvider>
      </BrowserRouter>
    </Container>
  );
}

export default App;
