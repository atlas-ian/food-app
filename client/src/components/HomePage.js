import React from 'react';
import FoodList from './FoodList';

const HomePage = () => {
  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Our Menu</h1>
        <p className="page-subtitle">
          Discover our delicious selection of freshly prepared meals
        </p>
      </div>
      <FoodList />
    </>
  );
};

export default HomePage;