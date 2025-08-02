// src/components/SuccessPage.js
import React, { useEffect, useState } from 'react';
import { Container, Header } from 'semantic-ui-react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { clearCart } from '../redux/cart/actions';

export default function SuccessPage() {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const sessionId = new URLSearchParams(search).get('session_id');
  const [message, setMessage] = useState('Verifying payment…');

  useEffect(() => {
    const verify = async () => {
      try {
        // In a real app, you’d verify the session & record the order server-side
        dispatch(clearCart()); // clear cart on success
        setMessage('Payment successful! Your order is confirmed.');
      } catch {
        setMessage('Payment verification failed.');
      }
    };
    verify();
  }, [dispatch]);

  return (
    <Container text style={{ marginTop: '2rem' }}>
      <Header as="h2">Checkout</Header>
      <p>{message}</p>
    </Container>
  );
}
