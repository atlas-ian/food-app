import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/user/actions';
import './Header.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const { userInfo } = useSelector(state => state.user);
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logoutUser());
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header__content">
          {/* Logo */}
          <Link to="/" className="header__logo">
            <span className="header__logo-icon">🍕</span>
            <span className="header__logo-text">FoodApp</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="header__nav header__nav--desktop">
            <Link 
              to="/" 
              className={`header__nav-link ${isActive('/') ? 'header__nav-link--active' : ''}`}
            >
              Menu
            </Link>
            <Link 
              to="/cart" 
              className={`header__nav-link ${isActive('/cart') ? 'header__nav-link--active' : ''}`}
            >
              Cart
              {cartItemCount > 0 && (
                <span className="header__cart-badge">{cartItemCount}</span>
              )}
            </Link>
            {userInfo ? (
              <div className="header__user-menu">
                <span className="header__user-name">Hi, {userInfo.name}</span>
                <button onClick={handleLogout} className="header__logout-btn">
                  Logout
                </button>
              </div>
            ) : (
              <div className="header__auth-links">
                <Link 
                  to="/login" 
                  className={`header__nav-link ${isActive('/login') ? 'header__nav-link--active' : ''}`}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className={`header__nav-link ${isActive('/register') ? 'header__nav-link--active' : ''}`}
                >
                  Register
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="header__menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span className={`header__menu-icon ${isMenuOpen ? 'header__menu-icon--open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className={`header__nav header__nav--mobile ${isMenuOpen ? 'header__nav--mobile-open' : ''}`}>
          <Link 
            to="/" 
            className={`header__nav-link ${isActive('/') ? 'header__nav-link--active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Menu
          </Link>
          <Link 
            to="/cart" 
            className={`header__nav-link ${isActive('/cart') ? 'header__nav-link--active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Cart
            {cartItemCount > 0 && (
              <span className="header__cart-badge">{cartItemCount}</span>
            )}
          </Link>
          {userInfo ? (
            <>
              <span className="header__user-name">Hi, {userInfo.name}</span>
              <button onClick={handleLogout} className="header__logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`header__nav-link ${isActive('/login') ? 'header__nav-link--active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className={`header__nav-link ${isActive('/register') ? 'header__nav-link--active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}