import { useEffect, useState } from 'react';
import { createBudget, checkBudgets } from '../controllers/budget.controller';
import { createBudgetModel } from '../models/budget.model';
import { getCurrentUser } from '../services/auth.service';

export default function BudgetPage() {
  const [budget, setBudget] = useState(createBudgetModel());
  const [checks, setChecks] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const user = getCurrentUser();
  const isAdmin = user?.role === 'ADMIN';

  const loadCheck = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await checkBudgets();
      setChecks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCheck();
  }, []);

  const handleChange = (field) => (event) => {
    setBudget({ ...budget, [field]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (!isAdmin) {
        throw new Error('Only ADMIN users can create budgets.');
      }

      await createBudget({ category: budget.category, limit: Number(budget.limit) });
      setSuccess('Budget created successfully.');
      setBudget(createBudgetModel());
      loadCheck();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="grid" style={{ gap: '24px' }}>
      <div className="panel">
        <h1>Budget management</h1>
        <p>Create budgets and compare expense totals against them.</p>
      </div>

      <div className="panel">
        <h2>Create new budget</h2>
        <form onSubmit={handleSubmit} className="grid grid-2">
          <div className="field">
            <label>Category</label>
            <input value={budget.category} onChange={handleChange('category')} required />
          </div>
          <div className="field">
            <label>Limit</label>
            <input type="number" step="0.01" value={budget.limit} onChange={handleChange('limit')} required />
          </div>
          {error && <div className="alert error">{error}</div>}
          {success && <div className="alert success">{success}</div>}
          <button type="submit" disabled={!isAdmin}>Save budget</button>
          {!isAdmin && <div className="notice">Budget creation is restricted to ADMIN roles.</div>}
        </form>
      </div>

      <div className="panel">
        <h2>Budget check</h2>
        {loading ? (
          <div className="loading">Loading budget data…</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Limit</th>
                <th>Spent</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {checks.map((item, index) => (
                <tr key={index}>
                  <td>{item.category}</td>
                  <td>{item.limit}</td>
                  <td>{item.spent}</td>
                  <td style={{ color: item.exceeded ? '#c53030' : '#2f855a' }}>
                    {item.exceeded ? 'Exceeded' : 'Within limit'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
