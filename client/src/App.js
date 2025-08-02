import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/ui/Header';
import FoodList from './components/FoodList';
import CartPage from './components/CartPage';
import './styles/design-system.css';
import './App.css';

function App() {
  return (
    <Router>
      <Header />
      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <div className="container">
                <div className="page-header">
                  <h1 className="page-title">Our Menu</h1>
                  <p className="page-subtitle">Discover our delicious selection of fresh, made-to-order meals</p>
                </div>
                <FoodList />
              </div>
            }
          />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
