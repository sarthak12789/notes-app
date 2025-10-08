import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { userAuth } from './authcontext';
import { useNavigate } from 'react-router-dom';

import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signupnewuser } = userAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signupnewuser(email, password);

      if (result.success) {
        navigate('/');
      } else {
        if (result.error.includes('User already registered')) {
          setError('User already exists. Redirecting to LogIn...');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          setError(result.error || 'Signup failed.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-signup">
      <div className="signup">
        <h2 className="title">Signup</h2>

        {/* Error Message */}
        {error && (
          <div style={{ color: 'red', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div className="email">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="Enter your email"
              type="email"
              required
            />
          </div>

          <div className="password">
            <label htmlFor="password">Password</label>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              toggleMask
              feedback={false}
              className="input"
              required
            />
          </div>

          <Button
            label={loading ? 'Signing up...' : 'Signup'}
            icon="pi pi-user-plus"
            className="button"
            type="submit"
            disabled={loading}
          />
          <p>Already have an account <a href="/login" style={{ color: '#007ad9', textDecoration: 'underline' }}>signIn</a></p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
