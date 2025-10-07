import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseclient';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // This is needed to refresh the session when user comes from magic link
    supabase.auth.getSession();
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const { data, error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Password updated successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  return (
    <div className="reset-password">
      <h2>Reset Password</h2>
      <form onSubmit={handleReset}>
        <label>New Password</label>
        <InputText
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          type="password"
          required
        />
        <Button label="Reset Password" type="submit" />
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  );
};

export default ResetPassword;
