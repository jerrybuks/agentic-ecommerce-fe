import { useState } from 'react';
import type { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  style?: React.CSSProperties;
  onViewProduct?: (productId: number) => void;
}

export default function ProductCard({ product, style, onViewProduct }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price: string) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const showPlaceholder = !product.primary_image || imageError;

  return (
    <div className="product-card fade-in" style={style}>
      <div className="product-image-container">
        {showPlaceholder ? (
          <div className="product-image-placeholder">
            <span>No Image</span>
          </div>
        ) : (
          <>
            {!imageLoaded && <div className="product-image-placeholder loading"></div>}
            <img
              src={product.primary_image!}
              alt={product.name}
              className={`product-image ${imageLoaded ? 'loaded' : 'loading'}`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </>
        )}
        {product.is_featured && (
          <span className="featured-badge">Featured</span>
        )}
      </div>
      <div className="product-info">
        <div className="product-brand">{product.brand}</div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">
          {product.description.length > 100
            ? `${product.description.substring(0, 100)}...`
            : product.description}
        </p>
                    <div className="product-footer">
          <div className="product-price">{formatPrice(product.price)}</div>
          <button
            className="btn btn-product"
            onClick={() => onViewProduct?.(product.id)}
          >
            View Product
          </button>
        </div>
        <div className="product-tags">
          {product.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
