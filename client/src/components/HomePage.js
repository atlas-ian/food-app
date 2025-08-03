import React, { useEffect } from 'react';
import { Card, Container, Header } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFoods } from '../redux/foods/actions';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const dispatch = useDispatch();
  const foods = useSelector((state) => state.foods.foods);

  useEffect(() => {
    dispatch(fetchFoods());
  }, [dispatch]);

  return (
    <Container>
      <Header as="h2">Menu</Header>
      <Card.Group>
        {foods.map((food) => (
          <Card
            key={food._id}
            image={food.image}
            header={food.name}
            meta={`₹${food.price}`}
            description={food.description}
            extra={<Link to={`/product/${food._id}`}>View</Link>}
          />
        ))}
      </Card.Group>
    </Container>
  );
};

export default HomePage;
