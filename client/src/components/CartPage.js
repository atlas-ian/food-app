// src/components/CartPage.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, clearCart } from '../redux/cart/actions';
import { Container, Header, List, Button, Divider } from 'semantic-ui-react';
import axios from 'axios';

export default function CartPage() {
  const dispatch = useDispatch();
  const items    = useSelector(state => state.cart.items);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const checkout = async () => {
    try {
      const api = process.env.REACT_APP_API_URL || 'http://localhost:4000';
      await axios.post(`${api}/api/orders`, {
        items,
        total,
      });
      dispatch(clearCart());
      alert('Order placed!');
    } catch (err) {
      console.error(err);
      alert('Checkout failed');
    }
  };

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Header as="h2">Your Cart</Header>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <List divided verticalAlign="middle">
          {items.map(i => (
            <List.Item key={i._id}>
              <List.Content floated="right">
                <Button 
                  size="tiny" 
                  negative 
                  onClick={() => dispatch(removeFromCart(i._id))}
                >
                  −
                </Button>
                <span style={{ margin: '0 0.5rem' }}>{i.quantity}</span>
                <Button 
                  size="tiny" 
                  positive
                  onClick={() => dispatch(addToCart(i))}
                >
                  +
                </Button>
              </List.Content>
              <List.Content>
                {i.name} × ${i.price.toFixed(2)} = ${(i.price * i.quantity).toFixed(2)}
              </List.Content>
            </List.Item>
          ))}
          <Divider />
          <List.Item>
            <List.Content floated="right">
              <Header as="h3">${total.toFixed(2)}</Header>
            </List.Content>
            <List.Content>
              <Header as="h3">Total</Header>
            </List.Content>
          </List.Item>
        </List>
      )}
      <Button 
        primary 
        disabled={items.length === 0} 
        onClick={checkout}
      >
        Checkout
      </Button>
    </Container>
  );
}
