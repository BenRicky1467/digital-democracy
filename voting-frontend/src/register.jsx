import React, { useState } from 'react';
import './App.css';
import { toast } from 'react-toastify';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    faculty: 'BCS',
    role: 'voter',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setLoading(false);
      if (response.ok) {
        toast.success('✅ Registered successfully!');
        console.log('Registered user:', data);
      } else {
        toast.error(`❌ Registration failed: ${data.message}`);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error during registration:', error);
      toast.error('❌ An error occurred during registration.');
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
        required
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />
      <select name="faculty" value={formData.faculty} onChange={handleChange}>
        <option value="BCS">BCS</option>
        <option value="BFIT">BFIT</option>
        <option value="BAED">BAED</option>
        <option value="LAW">LAW</option>
      </select>

      <button type="submit" className="register-button" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}

export default Register;
