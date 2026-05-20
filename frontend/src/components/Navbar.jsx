import { Link, useNavigate } from 'react-router-dom';
import { clearToken, getCurrentUser, isAuthenticated } from '../services/auth.service';

export default function Navbar() {
  const navigate = useNavigate();
  const auth = isAuthenticated();
  const user = getCurrentUser();

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/records">Records</Link>
          <Link to="/budget">Budget</Link>
          <Link to="/users">Test Users</Link>
        </div>
        <div className="nav-links">
          {auth ? (
            <>
              <span style={{ color: '#4a5568' }}>{user?.role || 'USER'}</span>
              <button className="outline" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
