import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/user/actions';
import { useNavigate, Link } from 'react-router-dom';
import Card, { CardContent, CardHeader, CardTitle } from './ui/Card';
import Button from './ui/Button';
import Alert from './ui/Alert';
import './ui/Form.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser({ email, password }));
      navigate('/');
    } catch (error) {
      // Error is handled by Redux
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <p className="auth-subtitle">Sign in to your account</p>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="error" title="Login Failed">
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" variant="primary" fullWidth loading={loading}>
              Sign In
            </Button>
          </form>
          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register" className="auth-link">Sign up</Link></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;