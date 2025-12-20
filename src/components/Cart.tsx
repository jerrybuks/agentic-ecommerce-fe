import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useProducts';

export default function Cart() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: cart, isLoading } = useCart();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const itemCount = cart?.item_count ?? 0;
  const totalFormatted = cart?.total_formatted ?? '$0.00';

  return (
    <div
      className="cart-container"
      ref={dropdownRef}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="cart-button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        aria-label="Shopping cart"
      >
        <svg
          className="cart-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
        <span className="cart-total">{totalFormatted}</span>
      </button>

      {isOpen && (
        <div className="cart-dropdown">
          <div className="cart-dropdown-header">
            <h3>Your Cart</h3>
            <button className="cart-close" onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>

          <div className="cart-dropdown-content">
            {isLoading ? (
              <div className="cart-loading">Loading...</div>
            ) : !cart || cart.items.length === 0 ? (
              <div className="cart-empty">
                <svg
                  className="cart-empty-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                <p>Your cart is empty</p>
                <span>
                  Add some products to get started or{' '}
                  <button
                    className="cart-empty-link"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsOpen(false);
                      // Navigate first
                      navigate('/orders');
                      // Close chatbot after navigation
                      setTimeout(() => {
                        window.dispatchEvent(new CustomEvent('close-chatbot'));
                      }, 50);
                    }}
                  >
                    view orders
                  </button>
                </span>
              </div>
            ) : (
              <>
                <ul className="cart-items">
                  {cart.items.map((item) => (
                    <li key={item.product_id} className="cart-item">
                      <div className="cart-item-image">
                        {item.primary_image ? (
                          <img src={item.primary_image} alt={item.product_name} />
                        ) : (
                          <div className="cart-item-placeholder">No img</div>
                        )}
                      </div>
                      <div className="cart-item-details">
                        <span className="cart-item-name">{item.product_name}</span>
                        <span className="cart-item-qty">Qty: {item.quantity}</span>
                      </div>
                      <span className="cart-item-price">${item.subtotal.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="cart-dropdown-footer">
                  <div className="cart-total-row">
                    <span>Total:</span>
                    <strong>{cart.total_formatted}</strong>
                  </div>
                  <button 
                    className="btn btn-primary cart-checkout-btn"
                    onClick={() => {
                      // Dispatch custom event to populate chatbot input
                      window.dispatchEvent(new CustomEvent('checkout-clicked'));
                      setIsOpen(false);
                    }}
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

