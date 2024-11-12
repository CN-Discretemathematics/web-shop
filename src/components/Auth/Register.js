import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',  
    phoneNumber: ''   
  });

  const navigate = useNavigate();
  const { signUp, loading, error:authError} = useAuth();
  const [error, setError]=useState('');
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      
      
      const additionalData = {
        displayName: formData.displayName,
        phoneNumber: formData.phoneNumber,
        updatedAt: new Date()
      };

      await signUp(formData.email, formData.password, additionalData);
      navigate('/');
    } catch (error) {
      setError('Failed to create an account: ' + error.message);
    } 
  }

  return (
    <div className="auth-container">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      {(error || authError) && (<div className="error-message">{error || authError}</div>)}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Display Name</label>
          <input
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <button
          disabled={loading}
          className="btn btn-primary"
          type="submit"
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
    </div>
  );
}

export default Register;