import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromCart, clearCart, addToCart } from '../redux/cart/actions';
import Card, { CardContent } from './ui/Card';
import Button, { IconButton } from './ui/Button';
import './CartPage.css';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51Rnti1COxAmCIkLff0rZtLzQKEqQEKlvnkw6hWUFmqvFK85XTaluPghrauCTAIA7SS44Bb4QNnkHrooUHRfGZfVd00b9xiueYA'); // TODO: Replace with your Stripe public key

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleIncreaseQuantity = (item) => {
    dispatch(addToCart(item));
  };

  const handleDecreaseQuantity = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleStripeCheckout = async () => {
    const stripe = await stripePromise;
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: cartItems }),
    });
    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert('Failed to initiate payment.');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty__icon">🛒</div>
        <h2 className="cart-empty__title">Your cart is empty</h2>
        <p className="cart-empty__description">
          Add some delicious items from our menu to get started!
        </p>
        <Link to="/">
          <Button variant="primary">Browse Menu</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-content">
      <div className="page-header">
        <h1 className="page-title">Your Cart</h1>
        <p className="page-subtitle">
          {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>

      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item._id} className="cart-item">
            <div className="cart-item__image">
              <img 
                src={item.imageUrl || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'} 
                alt={item.name}
              />
            </div>
            <div className="cart-item__details">
              <h3 className="cart-item__name">{item.name}</h3>
              <p className="cart-item__price">₹{item.price.toFixed(2)} each</p>
            </div>
            <div className="cart-item__quantity">
              <IconButton
                variant="ghost"
                size="sm"
                onClick={() => handleDecreaseQuantity(item._id)}
                aria-label="Decrease quantity"
              >
                −
              </IconButton>
              <span className="cart-item__quantity-value">{item.quantity}</span>
              <IconButton
                variant="ghost"
                size="sm"
                onClick={() => handleIncreaseQuantity(item)}
                aria-label="Increase quantity"
              >
                +
              </IconButton>
            </div>
            <div className="cart-item__total">
              ₹{(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <Card className="cart-summary">
        <CardContent>
          <div className="cart-summary__row">
            <span>Subtotal ({itemCount} items)</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <div className="cart-summary__row">
            <span>Delivery Fee</span>
            <span>₹2.99</span>
          </div>
          <div className="cart-summary__row cart-summary__row--total">
            <span>Total</span>
            <span>₹{(total + 2.99).toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <div className="cart-actions">
        <Button 
          variant="secondary" 
          onClick={handleClearCart}
        >
          Clear Cart
        </Button>
        <Button variant="primary" onClick={handleStripeCheckout} disabled={cartItems.length === 0}>
          Pay with Card (Stripe)
        </Button>
      </div>
    </div>
  );
};

export default CartPage;