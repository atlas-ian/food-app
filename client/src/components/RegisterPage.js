import React, { useState } from 'react';
import { Button, Form, Header, Container } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../redux/user/actions';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = () => {
    dispatch(registerUser({ name, email, password })).then(() => {
      navigate('/');
    });
  };

  return (
    <Container>
      <Header as="h2">Register</Header>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          Register
        </Button>
      </Form>
    </Container>
  );
};

export default RegisterPage;
