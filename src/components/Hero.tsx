import { useNavigate } from 'react-router-dom';
import Cart from './Cart';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="hero-top-bar">
        <Cart />
      </div>
      <div className="hero-content">
        <h1 className="hero-title">Welcome to Shoplytic</h1>
        <p className="hero-subtitle">
          The Future of E-Commerce
        </p>
        <p className="hero-description">
          Experience intelligent shopping powered by AI agents. Discover products, 
          get personalized recommendations, and enjoy a seamless shopping experience.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => navigate('/products')}>
            Shop Now
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/orders')}>
            View Orders
          </button>
        </div>
      </div>
    </section>
  );
}
