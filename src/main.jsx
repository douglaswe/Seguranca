import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './reset.css';
import { Cadastrar } from './Cadastrar';
import { Login } from './Login';
import { Termos } from './Termos';


createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route exact path="/" element={<Login />} /> 
      <Route path="/cadastrar" element={<Cadastrar />} /> 
      <Route path="/termos" element={<Termos />} /> 
    </Routes>
  </Router>
);
