'use client';

import Image from 'next/image';
import { Plus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import toast from 'react-hot-toast';

export function FoodCard({ food }) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(food);
    toast.success(`${food.name} added to cart!`);
  };

  return (
    <div className="card group hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-square overflow-hidden rounded-t-lg">
        <Image
          src={food.imageUrl || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
          alt={food.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
          {food.name}
        </h3>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-indigo-600">
            ₹{food.price.toFixed(2)}
          </span>
          
          <button
            onClick={handleAddToCart}
            className="btn-primary flex items-center space-x-1 px-4 py-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}