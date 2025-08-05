import Link from 'next/link';
import Image from 'next/image';

export function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="container py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Delicious Food
              <span className="block text-yellow-300">Delivered Fast</span>
            </h1>
            <p className="text-xl mb-8 text-indigo-100">
              Order from your favorite restaurants and get fresh, hot food delivered to your door in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="#menu"
                className="btn-primary bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 text-lg"
              >
                Order Now
              </Link>
              <Link
                href="/about"
                className="btn-outline border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-3 text-lg"
              >
                Learn More
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative w-full h-96 lg:h-[500px]">
              <Image
                src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
                alt="Delicious food"
                fill
                className="object-cover rounded-lg shadow-2xl"
                priority
              />
            </div>
            
            {/* Floating cards */}
            <div className="absolute -top-4 -left-4 bg-white text-gray-900 p-4 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">⭐</span>
                <div>
                  <div className="font-bold">4.9/5</div>
                  <div className="text-sm text-gray-600">Customer Rating</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-white text-gray-900 p-4 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🚚</span>
                <div>
                  <div className="font-bold">30 min</div>
                  <div className="text-sm text-gray-600">Avg. Delivery</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}