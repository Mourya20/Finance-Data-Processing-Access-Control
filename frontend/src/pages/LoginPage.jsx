import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../controllers/auth.controller';
import { createUserModel } from '../models/user.model';
import { useAuth } from '../services/auth.service';

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState(createUserModel({ role: 'VIEWER' }));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const updateField = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginUser({ email: form.email, password: form.password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel" style={{ maxWidth: 540, margin: '0 auto' }}>
      <h1>Login</h1>
      <p>Sign in to manage your finance records and dashboards.</p>
      <form onSubmit={handleSubmit} className="grid">
        <div className="field">
          <label>Email</label>
          <input type="email" value={form.email} onChange={updateField('email')} required />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={form.password} onChange={updateField('password')} required />
        </div>
        {error && <div className="alert error">{error}</div>}
        <button type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
      </form>
      <div className="notice">
        Don’t have an account? <Link to="/register">Register here</Link>.
      </div>
    </div>
  );
}
