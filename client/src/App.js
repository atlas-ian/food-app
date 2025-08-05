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
import SuccessPage from './components/SuccessPage';
import AdminOrdersPage from './components/AdminOrdersPage';


function App() {
  const dispatch = useDispatch();
  // Remove all userInfo, logoutUser, and authentication logic
  // Remove useSelector/useDispatch for user
  // Remove admin-only routes if not needed

  return (
    <Router>
      <Header 
        // userInfo={userInfo} 
        // onLogout={handleLogout} 
      />

      <main className="main-content">
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/success" element={<SuccessPage />} />
            {/* {userInfo?.isAdmin && (
              <Route path="/admin/orders" element={<AdminOrdersPage />} />
            )} */}
          </Routes>
        </div>
      </main>
    </Router>
  );
}

export default App;
