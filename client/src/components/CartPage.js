import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromCart, clearCart, addToCart } from '../redux/cart/actions';
import Card, { CardContent } from './ui/Card';
import Button, { IconButton } from './ui/Button';
import './CartPage.css';

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const { userInfo } = useSelector((state) => state.user);
  
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
              <p className="cart-item__price">${item.price.toFixed(2)} each</p>
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
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <Card className="cart-summary">
        <CardContent>
          <div className="cart-summary__row">
            <span>Subtotal ({itemCount} items)</span>
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
        </CardContent>
      </Card>

      <div className="cart-actions">
        <Button 
          variant="secondary" 
          onClick={handleClearCart}
        >
          Clear Cart
        </Button>
        {userInfo ? (
          <Button variant="primary">
            Proceed to Checkout
          </Button>
        ) : (
          <Link to="/login">
            <Button variant="primary">
              Login to Checkout
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default CartPage;