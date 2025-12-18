import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          Shoplytic
        </Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/products" className="navbar-link">Products</Link>
          <Link to="/orders" className="navbar-link">Orders</Link>
        </div>
      </div>
    </nav>
  );
}


