import { useEffect, useState } from 'react';
import { apiRequest } from '../services/api.service';

function UserGroup({ title, users, password }) {
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="panel">
      <h3>{title}</h3>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Password</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr key={idx}>
              <td>{user.email}</td>
              <td>
                <code style={{ backgroundColor: '#f0f0f0', padding: '4px 8px', borderRadius: '4px' }}>
                  {password}
                </code>
              </td>
              <td>
                <button
                  className="outline"
                  onClick={() => copyToClipboard(`${user.email}:${password}`)}
                  style={{ padding: '6px 12px', fontSize: '0.9rem' }}
                >
                  {copied === `${user.email}:${password}` ? '✓ Copied' : 'Copy'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function UsersPage() {
  const [admins, setAdmins] = useState([]);
  const [analysts, setAnalysts] = useState([]);
  const [viewers, setViewers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await apiRequest('/users/credentials');
        setAdmins(response.data.admins);
        setAnalysts(response.data.analysts);
        setViewers(response.data.viewers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="panel">
        <p>Loading credentials...</p>
      </div>
    );
  }

  return (
    <div className="grid" style={{ gap: '24px' }}>
      <div className="panel">
        <h1>🔑 Seeded Test Credentials</h1>
        <p>Use these credentials to test different user roles and permissions.</p>
        {error && <div className="alert error">{error}</div>}
      </div>

      <UserGroup
        title={`👤 Admins (${admins.length})`}
        users={admins}
        password="admin123"
      />

      <UserGroup
        title={`👥 Analysts (${analysts.length})`}
        users={analysts}
        password="analyst123"
      />

      <div className="panel">
        <h2>👨 Viewers ({viewers.length})</h2>
        <p>Format: viewer1@test.com through viewer50@test.com</p>
        <p>Password: <code style={{ backgroundColor: '#f0f0f0', padding: '4px 8px', borderRadius: '4px' }}>viewer123</code></p>
        <div className="grid grid-3" style={{ marginTop: '16px' }}>
          {viewers.slice(0, 12).map((viewer, idx) => (
            <div key={idx} style={{ padding: '8px', backgroundColor: '#f8fbff', borderRadius: '8px', textAlign: 'center' }}>
              <small>{viewer.email}</small>
            </div>
          ))}
          {viewers.length > 12 && (
            <div style={{ padding: '8px', backgroundColor: '#f8fbff', borderRadius: '8px', textAlign: 'center' }}>
              <small>...and {viewers.length - 12} more</small>
            </div>
          )}
        </div>
      </div>

      <div className="panel">
        <h2>📋 Permission Summary</h2>
        <table>
          <thead>
            <tr>
              <th>Role</th>
              <th>Can View Records</th>
              <th>Can Create Records</th>
              <th>Can Edit Records</th>
              <th>Can Delete Records</th>
              <th>Can View Dashboard</th>
              <th>Can Create Budget</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>ADMIN</strong></td>
              <td>✅</td>
              <td>✅</td>
              <td>✅</td>
              <td>✅</td>
              <td>✅</td>
              <td>✅</td>
            </tr>
            <tr>
              <td><strong>ANALYST</strong></td>
              <td>✅</td>
              <td>❌</td>
              <td>❌</td>
              <td>❌</td>
              <td>✅</td>
              <td>❌</td>
            </tr>
            <tr>
              <td><strong>VIEWER</strong></td>
              <td>✅</td>
              <td>❌</td>
              <td>❌</td>
              <td>❌</td>
              <td>✅</td>
              <td>❌</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="panel">
        <h2>🧪 Testing Guide</h2>
        <ol style={{ lineHeight: '1.8' }}>
          <li><strong>Test ADMIN Role:</strong> Login with admin1@test.com / admin123. You can create, edit, and delete records.</li>
          <li><strong>Test ANALYST Role:</strong> Login with analyst1@test.com / analyst123. You can view everything but cannot modify records.</li>
          <li><strong>Test VIEWER Role:</strong> Login with viewer1@test.com / viewer123. You can view records and dashboard only.</li>
          <li><strong>Test Access Control:</strong> Try accessing restricted endpoints with different roles to see RBAC in action.</li>
          <li><strong>Test Budget Feature:</strong> Only ADMIN can create budgets; other roles can only view them.</li>
        </ol>
      </div>
    </div>
  );
}
