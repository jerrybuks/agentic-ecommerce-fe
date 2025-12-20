import { useState, useEffect } from 'react';
import { fetchProduct, type ProductDetail } from '../services/api';
import './ProductModal.css';

interface ProductModalProps {
  productId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ productId, isOpen, onClose }: ProductModalProps) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen && productId) {
      setIsLoading(true);
      setError(null);
      setCurrentImageIndex(0);

      fetchProduct(productId)
        .then((data) => {
          setProduct(data);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Failed to load product');
          setIsLoading(false);
        });
    } else {
      setProduct(null);
      setError(null);
    }
  }, [isOpen, productId]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Store the original values
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const originalWidth = document.body.style.width;
      const scrollY = window.scrollY;
      
      // Calculate scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Prevent scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      
      return () => {
        // Restore original values
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.width = originalWidth;
        document.body.style.paddingRight = '';
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const formatPrice = (price: string) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const images = product?.images && product.images.length > 0 ? product.images : product?.primary_image ? [product.primary_image] : [];
  const currentImage = images[currentImageIndex] || null;

  return (
    <div className="product-modal-overlay" onClick={handleBackdropClick}>
      <div className="product-modal">
        <button className="product-modal-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {isLoading ? (
          <div className="product-modal-loading">
            <div className="loading-spinner"></div>
            <p>Loading product details...</p>
          </div>
        ) : error ? (
          <div className="product-modal-error">
            <div className="product-modal-error-icon">⚠️</div>
            <h3>Error</h3>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        ) : product ? (
          <div className="product-modal-content">
            <div className="product-modal-images">
              {images.length > 0 ? (
                <>
                  <div className="product-modal-main-image">
                    {currentImage ? (
                      <img src={currentImage} alt={product.name} />
                    ) : (
                      <div className="product-modal-image-placeholder">
                        <span>No Image</span>
                      </div>
                    )}
                  </div>
                  {images.length > 1 && (
                    <div className="product-modal-thumbnails">
                      {images.map((img, index) => (
                        <button
                          key={index}
                          className={`product-modal-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <img src={img} alt={`${product.name} view ${index + 1}`} />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="product-modal-image-placeholder large">
                  <span>No Image Available</span>
                </div>
              )}
            </div>

            <div className="product-modal-info">
              <div className="product-modal-header">
                <div className="product-modal-brand">{product.brand}</div>
                <h1 className="product-modal-name">{product.name}</h1>
                <div className="product-modal-badges">
                  <span className="product-modal-category-badge">{product.category}</span>
                  {product.is_featured && (
                    <span className="product-modal-featured">Featured</span>
                  )}
                </div>
              </div>

              <div className="product-modal-price-section">
                <div className="product-modal-price">{formatPrice(product.price)}</div>
                {product.stock_quantity > 0 ? (
                  <span className={`product-modal-stock ${product.stock_quantity <= product.low_stock_threshold ? 'low' : ''}`}>
                    {product.stock_quantity <= product.low_stock_threshold
                      ? `Only ${product.stock_quantity} left in stock`
                      : `In Stock (${product.stock_quantity} available)`}
                  </span>
                ) : (
                  <span className="product-modal-stock out">Out of Stock</span>
                )}
              </div>

              <div className="product-modal-description">
                <h2>Description</h2>
                <p>{product.description}</p>
              </div>

              <div className="product-modal-details">
                <div className="product-modal-detail-row">
                  <span className="product-modal-detail-label">SKU:</span>
                  <span className="product-modal-detail-value">{product.sku}</span>
                </div>
                <div className="product-modal-detail-row">
                  <span className="product-modal-detail-label">Category:</span>
                  <span className="product-modal-detail-value">{product.category}</span>
                </div>
                {product.dimensions && (
                  <div className="product-modal-detail-row">
                    <span className="product-modal-detail-label">Dimensions:</span>
                    <span className="product-modal-detail-value">
                      {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} {product.dimensions.unit}
                    </span>
                  </div>
                )}
                {product.weight && (
                  <div className="product-modal-detail-row">
                    <span className="product-modal-detail-label">Weight:</span>
                    <span className="product-modal-detail-value">{product.weight} g</span>
                  </div>
                )}
              </div>

              {product.tags && product.tags.length > 0 && (
                <div className="product-modal-tags">
                  <h3>Tags</h3>
                  <div className="product-modal-tags-list">
                    {product.tags.map((tag, index) => (
                      <span key={index} className="product-modal-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

