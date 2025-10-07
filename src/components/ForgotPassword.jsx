import React, { useState } from 'react';
import { supabase } from '../supabaseclient';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Password reset link sent! Check your email.');
    }
  };

  return (
    <div className="forgot-password">
      <h2>Forgot Password</h2>
      <form onSubmit={handlePasswordReset}>
        <label>Email</label>
        <InputText
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button label="Send Reset Link" type="submit" />
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
