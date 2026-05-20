import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../controllers/auth.controller';
import { createUserModel } from '../models/user.model';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(createUserModel());
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await registerUser(form);
      setSuccess('Registration successful. You may sign in now.');
      setForm(createUserModel());
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel" style={{ maxWidth: 600, margin: '0 auto' }}>
      <h1>Create an account</h1>
      <p>Register with a role so the backend RBAC can be tested.</p>
      <form onSubmit={handleSubmit} className="grid">
        <div className="field">
          <label>Email</label>
          <input type="email" value={form.email} onChange={updateField('email')} required />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={form.password} onChange={updateField('password')} required />
        </div>
        <div className="field">
          <label>Role</label>
          <select value={form.role} onChange={updateField('role')} required>
            <option value="ADMIN">ADMIN</option>
            <option value="ANALYST">ANALYST</option>
            <option value="VIEWER">VIEWER</option>
          </select>
        </div>
        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}
        <button type="submit" disabled={loading}>{loading ? 'Creating account…' : 'Register'}</button>
      </form>
      <div className="notice">
        Already have an account? <Link to="/login">Sign in</Link>.
      </div>
    </div>
  );
}
