import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, clearCart } from '../redux/cart/actions';
import Button, { IconButton } from './ui/Button';
import Alert from './ui/Alert';
import axios from 'axios';
import './CartPage.css';

export default function CartPage() {
  const dispatch = useDispatch();
  const items    = useSelector(state => state.cart.items);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const checkout = async () => {
   const api = process.env.REACT_APP_API_URL;
   try {
     const { data } = await axios.post(
       `${api}/api/create-checkout-session`,
       { items },
       { headers: { Authorization: `Bearer ${userInfo.token}` } }
     );
     window.location.href = data.url; // redirect to Stripe Checkout
   } catch (err) {
     console.error(err);
     alert('Failed to start checkout');
   }
 };

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Your Cart</h1>
        {items.length > 0 && (
          <p className="page-subtitle">
            {items.length} item{items.length !== 1 ? 's' : ''} in your cart
          </p>
        )}
      </div>
      
      {items.length === 0 ? (
        <div className="cart-empty">
          <div className="cart-empty__icon">🛒</div>
          <h3 className="cart-empty__title">Your cart is empty</h3>
          <p className="cart-empty__description">
            Add some delicious items from our menu to get started!
          </p>
          <Button variant="primary" onClick={() => window.history.back()}>
            Browse Menu
          </Button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {items.map(item => (
              <div key={item._id} className="cart-item">
                <div className="cart-item__image">
                  <img 
                    src={item.imageUrl || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'} 
                    alt={item.name}
                  />
                </div>
                <div className="cart-item__details">
                  <h3 className="cart-item__name">{item.name}</h3>
                  <p className="cart-item__price">${item.price.toFixed(2)} each</p>
                </div>
                <div className="cart-item__quantity">
                  <IconButton
                    variant="ghost"
                    size="sm"
                    onClick={() => dispatch(removeFromCart(item._id))}
                    aria-label="Decrease quantity"
                  >
                    −
                  </IconButton>
                  <span className="cart-item__quantity-value">{item.quantity}</span>
                  <IconButton
                    variant="ghost"
                    size="sm"
                    onClick={() => dispatch(addToCart(item))}
                    aria-label="Increase quantity"
                  >
                    +
                  </IconButton>
                </div>
                <div className="cart-item__total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="cart-summary__row">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="cart-summary__row">
              <span>Delivery Fee</span>
              <span>$2.99</span>
            </div>
            <div className="cart-summary__row cart-summary__row--total">
              <span>Total</span>
              <span>${(total + 2.99).toFixed(2)}</span>
            </div>
          </div>
          
          <div className="cart-actions">
            <Button
              variant="secondary"
              onClick={() => dispatch(clearCart())}
              disabled={items.length === 0}
            >
              Clear Cart
            </Button>
            <Button
              variant="primary"
              size="lg"
              disabled={items.length === 0}
              onClick={checkout}
            >
              Checkout ${(total + 2.99).toFixed(2)}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
