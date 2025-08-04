// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import './styles/design-system.css';
import './App.css';

import Header from './components/ui/Header';
import HomePage from './components/HomePage';
import ProductPage from './components/ProductPage';
import CartPage from './components/CartPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import SuccessPage from './components/SuccessPage';
import AdminOrdersPage from './components/AdminOrdersPage';

import { logoutUser } from './redux/user/actions';

function App() {
  const dispatch = useDispatch();
  const userInfo = useSelector(state => state.user.userInfo);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <Router>
      <Header 
        userInfo={userInfo} 
        onLogout={handleLogout} 
      />

      <>
        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/success" element={<SuccessPage />} />
              {userInfo?.isAdmin && (
                <Route path="/admin/orders" element={<AdminOrdersPage />} />
              )}
            </Routes>
          </div>
        </main>
      </>
    </Router>
  );
}

export default App;
