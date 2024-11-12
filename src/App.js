import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Home from './components/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import './App.css';

function App() {
  return (
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
        </div>
      </Router>
  );
}

export default App;