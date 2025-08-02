import { Container, Header, Menu } from 'semantic-ui-react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FoodList from './components/FoodList';
import CartPage from './components/CartPage';

function App() {
  return (
    <Router>
      <Menu inverted>
        <Container>
          <Menu.Item as={Link} to="/">Menu</Menu.Item>
          <Menu.Item as={Link} to="/cart">Cart</Menu.Item>
        </Container>
      </Menu>
      <Container style={{ marginTop: '2rem' }}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header as="h1" textAlign="center">Our Menu</Header>
                <FoodList />
              </>
            }
          />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
