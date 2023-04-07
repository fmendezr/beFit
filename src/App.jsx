import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DBProvider } from './contexts/DBContext';
import { StorageProvider } from './contexts/StorageContext';
import { Container } from 'react-bootstrap';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import AddPost from './components/AddPost';
import UserProfile from './components/UserProfile';
import Camera from './components/Camera';
import PrivateRoute from "./PrivateRoute";
//import './App.css';

function App() {
  return (

      <BrowserRouter>
        <AuthProvider>
        <DBProvider>
        <StorageProvider>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/" element={<PrivateRoute><Home/></PrivateRoute>}/>
          <Route path="/:displayName" element={<PrivateRoute><UserProfile/></PrivateRoute>}/>
          <Route path="/add-post" element={<PrivateRoute><AddPost/></PrivateRoute>} />
        </Routes>
        </StorageProvider>
        </DBProvider>
        </AuthProvider>
      </BrowserRouter>
  );
}

export default App;
