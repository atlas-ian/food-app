import React from 'react';
import { useSelector } from 'react-redux';

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items);

  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.map((item) => (
        <div key={item._id}>
          <p>{item.name}</p>
          <p>Quantity: {item.quantity}</p>
        </div>
      ))}
    </div>
  );
};

export default CartPage;
