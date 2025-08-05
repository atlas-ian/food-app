import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers/Providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'FoodApp - Delicious Food Delivered',
  description: 'Order your favorite food from the best restaurants in town',
  keywords: 'food delivery, restaurant, order online, fast delivery',
  authors: [{ name: 'FoodApp Team' }],
  openGraph: {
    title: 'FoodApp - Delicious Food Delivered',
    description: 'Order your favorite food from the best restaurants in town',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FoodApp - Delicious Food Delivered',
    description: 'Order your favorite food from the best restaurants in town',
  },
  manifest: '/manifest.json',
  themeColor: '#6366f1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}