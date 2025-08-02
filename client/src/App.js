import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Menu } from 'semantic-ui-react';

import HomePage from './components/HomePage';
import ProductPage from './components/ProductPage';
import CartPage from './components/CartPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import SuccessPage from './components/SuccessPage';
import AdminOrdersPage from './components/AdminOrdersPage';

function App() {
  const userInfo = useSelector((state) => state.auth.userInfo);

  return (
    <Router>
      <Menu inverted>
        <Menu.Item as={Link} to="/">Home</Menu.Item>
        <Menu.Item as={Link} to="/cart">Cart</Menu.Item>
        {userInfo ? (
          <>
            <Menu.Item>{userInfo.name}</Menu.Item>
            {userInfo.isAdmin && (
              <Menu.Item as={Link} to="/admin/orders">Admin</Menu.Item>
            )}
          </>
        ) : (
          <>
            <Menu.Item as={Link} to="/login">Login</Menu.Item>
            <Menu.Item as={Link} to="/register">Register</Menu.Item>
          </>
        )}
      </Menu>

      <Container style={{ marginTop: '2rem' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
