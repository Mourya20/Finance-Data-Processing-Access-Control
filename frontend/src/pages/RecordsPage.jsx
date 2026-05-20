import { useEffect, useMemo, useState } from 'react';
import { fetchRecords, createRecord, updateRecord, deleteRecord } from '../controllers/record.controller';
import { createRecordModel } from '../models/record.model';
import { getCurrentUser } from '../services/auth.service';

const recordTypes = ['INCOME', 'EXPENSE'];

export default function RecordsPage() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(createRecordModel());
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState(null);

  const user = getCurrentUser();
  const isAdmin = user?.role === 'ADMIN';

  const loadRecords = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchRecords({ page, limit, search });
      setRecords(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [page, search]);

  const updateField = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (!isAdmin) {
        throw new Error('Only ADMIN users can create or update records.');
      }

      if (editing) {
        await updateRecord(editing.id, form);
        setSuccess('Record updated successfully.');
      } else {
        await createRecord(form);
        setSuccess('Record created successfully.');
      }

      setForm(createRecordModel());
      setEditing(null);
      loadRecords();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (record) => {
    setEditing(record);
    setForm({
      amount: record.amount,
      type: record.type,
      category: record.category,
      notes: record.notes || '',
      date: record.createdAt ? record.createdAt.split('T')[0] : ''
    });
  };

  const handleDelete = async (record) => {
    if (!window.confirm('Delete this record?')) return;
    setError('');
    setSuccess('');
    try {
      await deleteRecord(record.id);
      setSuccess('Record deleted successfully.');
      loadRecords();
    } catch (err) {
      setError(err.message);
    }
  };

  const recordCount = records.length;

  const pagerLabel = useMemo(() => {
    if (recordCount === 0) return 'No records found.';
    return `Showing ${recordCount} record${recordCount === 1 ? '' : 's'}`;
  }, [recordCount]);

  return (
    <div className="grid" style={{ gap: '24px' }}>
      <div className="panel">
        <h1>Records</h1>
        <p>Search, review, and manage financial records.</p>
      </div>

      <div className="panel grid" style={{ gap: '20px' }}>
        <div className="field">
          <label>Search by category or notes</label>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search records" />
        </div>
        <div className="field">
          <label>Page</label>
          <input type="number" min="1" value={page} onChange={(e) => setPage(Number(e.target.value) || 1)} />
        </div>
      </div>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <div className="panel">
        <h2>{isAdmin ? (editing ? 'Edit record' : 'Create record') : 'Record details'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-2">
          <div className="field">
            <label>Amount</label>
            <input type="number" step="0.01" value={form.amount} onChange={updateField('amount')} required />
          </div>
          <div className="field">
            <label>Type</label>
            <select value={form.type} onChange={updateField('type')} disabled={!isAdmin}>
              {recordTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Category</label>
            <input value={form.category} onChange={updateField('category')} required />
          </div>
          <div className="field">
            <label>Date</label>
            <input type="date" value={form.date} onChange={updateField('date')} />
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label>Notes</label>
            <textarea rows="3" value={form.notes} onChange={updateField('notes')} />
          </div>
          <div className="button-row" style={{ gridColumn: '1 / -1' }}>
            <button type="submit" disabled={!isAdmin}>{editing ? 'Update record' : 'Create record'}</button>
            {editing && <button type="button" className="secondary" onClick={() => { setEditing(null); setForm(createRecordModel()); }}>Cancel</button>}
          </div>
        </form>
        {!isAdmin && <div className="notice">Only ADMIN users can create, update, or delete records.</div>}
      </div>

      <div className="panel">
        <h2>{pagerLabel}</h2>
        {loading ? (
          <div className="loading">Loading records…</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Notes</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>{new Date(record.createdAt).toLocaleDateString()}</td>
                  <td>{record.category}</td>
                  <td>{record.type}</td>
                  <td>{record.amount}</td>
                  <td>{record.notes || '—'}</td>
                  {isAdmin && (
                    <td>
                      <button className="outline" onClick={() => handleEdit(record)}>Edit</button>
                      <button className="danger" onClick={() => handleDelete(record)}>Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
