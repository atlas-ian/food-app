import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFoods } from '../redux/foods/actions';
import FoodList from './FoodList';

const HomePage = () => {
  const dispatch = useDispatch();
  const { items: foods } = useSelector((state) => state.foods);

  useEffect(() => {
    dispatch(fetchFoods());
  }, [dispatch]);

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
