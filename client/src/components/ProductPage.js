import React, { useEffect, useState } from 'react';
import { Button, Container, Header, Image } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { addToCart } from '../redux/cart/actions';

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`/api/foods/${id}`).then((res) => {
      setProduct(res.data);
    });
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <Container>
      <Header as="h2">{product.name}</Header>
      <Image src={product.image} size="medium" />
      <p>{product.description}</p>
      <p><strong>₹{product.price}</strong></p>
      <Button onClick={() => dispatch(addToCart(product))}>Add to Cart</Button>
    </Container>
  );
};

export default ProductPage;
