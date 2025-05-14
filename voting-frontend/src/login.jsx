import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './context/UserContext'; // ✅ Import UserContext
import './login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { setUser } = useContext(UserContext); // ✅ Access setUser from context

  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('🔍 Backend response:', data);

      if (response.ok) {
        console.log('✅ Login successful:', data);
        localStorage.setItem('token', data.token);

        // ✅ Decode token and update context
        const decoded = JSON.parse(atob(data.token.split('.')[1]));
        setUser(decoded); // ✅ Immediate context update

        alert('Login successful!');

        // ✅ Redirect based on role
        if (decoded.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/vote');
        }
      } else {
        const errorMsg = data?.message || `Login failed: ${response.status}`;
        console.error('❌ Backend error:', errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      console.error('🚨 Network or server error:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
