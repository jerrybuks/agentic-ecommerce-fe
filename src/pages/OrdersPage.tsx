import { useState } from 'react';
import { useOrders } from '../hooks/useProducts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './OrdersPage.css';

export default function OrdersPage() {
  const { data: orders, isLoading, isError, error } = useOrders();
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return '#22c55e';
      case 'pending':
        return '#f59e0b';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const toggleOrder = (orderId: number) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const isExpanded = (orderId: number) => expandedOrders.has(orderId);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="orders-page">
          <div className="container">
            <h1 className="orders-title">My Orders</h1>
            <div className="orders-loading">
              <div className="loading-spinner"></div>
              <p>Loading your orders...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Navbar />
        <div className="orders-page">
          <div className="container">
            <h1 className="orders-title">My Orders</h1>
            <div className="orders-error">
              <p>⚠️ {error instanceof Error ? error.message : 'Failed to load orders'}</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const ordersList = orders || [];

  return (
    <>
      <Navbar />
      <div className="orders-page">
        <div className="container">
          <h1 className="orders-title">My Orders</h1>

          {ordersList.length === 0 ? (
            <div className="orders-empty">
              <div className="orders-empty-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                </svg>
              </div>
              <h2>No orders yet</h2>
              <p>You haven't placed any orders. Start shopping to see your orders here!</p>
            </div>
          ) : (
            <div className="orders-list">
              {ordersList.map((order) => {
                const expanded = isExpanded(order.id);
                const firstItem = order.items[0];
                const remainingItemsCount = order.items.length - 1;

                return (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div className="order-header-left">
                        <div className="order-id">Order #{order.id}</div>
                        <div className="order-date">{formatDate(order.created_at)}</div>
                      </div>
                      <div className="order-header-right">
                        <span
                          className="order-status"
                          style={{ backgroundColor: getStatusColor(order.status) }}
                        >
                          {order.status}
                        </span>
                        <div className="order-total">{formatPrice(order.total_amount)}</div>
                      </div>
                    </div>

                    {order.voucher_code && (
                      <div className="order-voucher">
                        <span className="order-voucher-label">Voucher:</span>
                        <span className="order-voucher-code">{order.voucher_code}</span>
                      </div>
                    )}

                    {/* Collapsed view - show first item and summary */}
                    {!expanded && (
                      <div className="order-summary">
                        <div className="order-summary-item">
                          <span className="order-summary-item-name">
                            {firstItem?.product_name || 'No items'}
                          </span>
                          {remainingItemsCount > 0 && (
                            <span className="order-summary-more">
                              +{remainingItemsCount} more item{remainingItemsCount !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        <div className="order-summary-shipping">
                          {order.shipping_address.city}, {order.shipping_address.zip_code}
                        </div>
                      </div>
                    )}

                    {/* Expanded view - show all details */}
                    {expanded && (
                      <>
                        <div className="order-items">
                          <h3 className="order-items-title">Items ({order.items.length})</h3>
                          <div className="order-items-list">
                            {order.items.map((item) => (
                              <div key={item.id} className="order-item">
                                <div className="order-item-info">
                                  <div className="order-item-name">{item.product_name}</div>
                                  <div className="order-item-details">
                                    <span>Qty: {item.quantity}</span>
                                    <span>×</span>
                                    <span>{formatPrice(item.unit_price)}</span>
                                  </div>
                                </div>
                                <div className="order-item-subtotal">
                                  {formatPrice(item.subtotal)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="order-shipping">
                          <h3 className="order-shipping-title">Shipping Address</h3>
                          <div className="order-shipping-address">
                            <p>{order.shipping_address.full_name}</p>
                            <p>{order.shipping_address.address}</p>
                            <p>
                              {order.shipping_address.city}, {order.shipping_address.zip_code}
                            </p>
                          </div>
                        </div>
                      </>
                    )}

                    <button
                      className="order-toggle-btn"
                      onClick={() => toggleOrder(order.id)}
                      aria-expanded={expanded}
                    >
                      <span>{expanded ? 'Show Less' : 'Show Details'}</span>
                      <svg
                        className={`order-toggle-icon ${expanded ? 'expanded' : ''}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

