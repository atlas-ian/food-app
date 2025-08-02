// client/src/components/FoodList.js

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFoods } from '../redux/foods/actions';
import { Card, Image, Loader, Message, Button } from 'semantic-ui-react';
import { addToCart } from '../redux/cart/actions';

export default function FoodList() {
  const dispatch = useDispatch();
  const { loading, items, error } = useSelector(state => state.foods);

  useEffect(() => {
    dispatch(fetchFoods());
  }, [dispatch]);

  if (loading) return <Loader active inline="centered" />;
  if (error)   return <Message error header="Error" content={error} />;

  return (
    <Card.Group itemsPerRow={3} stackable>
      {items.map(food => (
        <Card key={food._id}>
          <Image src={food.imageUrl} wrapped ui={false} />
          <Card.Content>
            <Card.Header>{food.name}</Card.Header>
            <Card.Meta>${food.price.toFixed(2)}</Card.Meta>
          </Card.Content>
          <Card.Content extra>
            <Button
              fluid
              primary
              onClick={() => dispatch(addToCart(food))}
            >
              Add to Cart
            </Button>
          </Card.Content>
        </Card>
      ))}
    </Card.Group>
  );
}
