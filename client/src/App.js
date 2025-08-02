// client/src/App.js
import React from 'react';
import { Container, Header } from 'semantic-ui-react';
import FoodList from './components/FoodList';

function App() {
  return (
    <Container style={{ marginTop: '2rem' }}>
      <Header as="h1" textAlign="center">Our Menu</Header>
      <FoodList />
    </Container>
  );
}

export default App;
