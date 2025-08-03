import React, { useState } from 'react';
import { Button, Form, Header, Container } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/user/actions';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = () => {
    dispatch(loginUser({ email, password })).then(() => {
      navigate('/');
    });
  };

  return (
    <Container>
      <Header as="h2">Login</Header>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Form.Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" primary>
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default LoginPage;
