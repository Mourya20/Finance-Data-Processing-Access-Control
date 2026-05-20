import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="panel" style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/dashboard"><button className="outline">Go to Dashboard</button></Link>
    </div>
  );
}
