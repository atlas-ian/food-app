
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFoods } from '../redux/foods/actions';
import Card, { CardImage, CardContent, CardTitle, CardMeta, CardActions } from './ui/Card';
import Button from './ui/Button';
import { LoaderPage } from './ui/Loader';
import Alert from './ui/Alert';
import { addToCart } from '../redux/cart/actions';
import './FoodList.css';

export default function FoodList() {
  const dispatch = useDispatch();
  const { loading, items, error } = useSelector(state => state.foods);

  useEffect(() => {
    dispatch(fetchFoods());
  }, [dispatch]);

  if (loading) return <LoaderPage message="Loading delicious food..." />;
  if (error) return (
    <div className="container">
      <Alert variant="error" title="Failed to load menu">
        {error}
      </Alert>
    </div>
  );

  if (items.length === 0) {
    return (
      <div className="container">
        <Alert variant="info" title="No items available">
          Our menu is currently being updated. Please check back soon!
        </Alert>
      </div>
    );
  }

  return (
    <div className="food-list">
      {items.map(food => (
        <Card key={food._id} hover padding="none">
          <CardImage 
            src={food.imageUrl || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'} 
            alt={food.name}
            aspectRatio="16/9"
          />
          <CardContent>
            <CardTitle>{food.name}</CardTitle>
            <CardMeta>₹{food.price.toFixed(2)}</CardMeta>
            <CardActions>
              <Button
                variant="primary"
                fullWidth
                onClick={() => dispatch(addToCart(food))}
              >
                Add to Cart
              </Button>
            </CardActions>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Loading skeleton component
export function FoodListSkeleton() {
  return (
    <div className="food-list">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} padding="none">
          <div className="skeleton skeleton--image" />
          <CardContent>
            <div className="skeleton skeleton--title" />
            <div className="skeleton skeleton--text" style={{ width: '60%' }} />
            <CardActions>
              <div className="skeleton skeleton--button" />
            </CardActions>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
