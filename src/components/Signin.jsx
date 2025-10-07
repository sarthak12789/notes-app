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

export const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { session, signinuser } = userAuth();
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signinuser({email, password});

      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Signin failed.');
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
        <h2 className="title">SignIn</h2>

        {/* Error Message */}
        {error && (
          <div style={{ color: 'red', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSignin}>
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
            label={loading ? 'Signing up...' : 'LOGIN'}
            icon="pi pi-user-plus"
            className="button"
            type="submit"
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
};

