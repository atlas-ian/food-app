'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { paymentsAPI } from '@/lib/api/payments';
import toast from 'react-hot-toast';

export function CartPage() {
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const deliveryFee = 2.99;
  const finalTotal = total + deliveryFee;

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsLoading(true);
    try {
      const { url } = await paymentsAPI.createCheckoutSession(items);
      window.location.href = url;
    } catch (error) {
      toast.error('Failed to initiate checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container">
          <div className="max-w-md mx-auto text-center">
            <div className="mb-8">
              <ShoppingBag className="mx-auto h-24 w-24 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Add some delicious items from our menu to get started!
            </p>
            <Link href="/" className="btn-primary">
              Browse Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
            <p className="text-gray-600 mt-2">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="card p-0 overflow-hidden">
                {items.map((item, index) => (
                  <div
                    key={item._id}
                    className={`p-6 ${index !== items.length - 1 ? 'border-b border-gray-200' : ''}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={item.imageUrl || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
                          alt={item.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-gray-600">₹{item.price.toFixed(2)} each</p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <div className="text-lg font-semibold text-gray-900 w-20 text-right">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                        
                        <button
                          onClick={() => removeItem(item._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                    <span className="font-medium">₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>₹{finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="btn-primary w-full py-3 text-base"
                  >
                    {isLoading ? 'Processing...' : 'Proceed to Checkout'}
                  </button>
                  
                  <button
                    onClick={clearCart}
                    className="btn-outline w-full py-3 text-base"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}