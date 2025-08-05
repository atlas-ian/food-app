import { Suspense } from 'react';
import { FoodGrid } from '@/components/food/FoodGrid';
import { FoodGridSkeleton } from '@/components/food/FoodGridSkeleton';
import { Hero } from '@/components/home/Hero';

export const metadata = {
  title: 'FoodApp - Delicious Food Delivered Fast',
  description: 'Discover amazing food from local restaurants. Fast delivery, great prices, and fresh ingredients.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      
      <section className="py-12 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Menu
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our delicious selection of freshly prepared meals from the best local restaurants
            </p>
          </div>
          
          <Suspense fallback={<FoodGridSkeleton />}>
            <FoodGrid />
          </Suspense>
        </div>
      </section>
    </div>
  );
}