import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFeaturedProducts } from '../hooks/useProducts';

function ProductImage({ src, alt, index }: { src: string | null; alt: string; index: number }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Use eager loading for first 4 images (above the fold)
  const loadingStrategy = index < 4 ? 'eager' : 'lazy';

  if (!src || error) {
    return (
      <div className="product-image-placeholder">
        <span>No Image</span>
      </div>
    );
  }

  return (
    <>
      {!loaded && <div className="product-image-placeholder loading"></div>}
      <img
        src={src}
        alt={alt}
        className={`product-image ${loaded ? 'loaded' : 'loading'}`}
        loading={loadingStrategy}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </>
  );
}

export default function Products() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useFeaturedProducts();
  const products = data?.products ?? [];

  const formatPrice = (price: string) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  if (isError) {
    return (
      <section className="products">
        <div className="container">
          <h2 className="section-title">Spotlight Products</h2>
          <div className="error-message">
            <p>⚠️ {error instanceof Error ? error.message : 'Failed to load products'}</p>
            <button onClick={() => refetch()} className="btn btn-primary">
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="products">
      <div className="container">
        <h2 className="section-title">Spotlight Products</h2>
        <div className="products-grid">
          {isLoading
            ? [...Array(8)].map((_, i) => (
                <div key={i} className="product-card skeleton">
                  <div className="product-image-container">
                    <div className="product-image-placeholder"></div>
                  </div>
                  <div className="product-info">
                    <div className="skeleton-text" style={{ width: '40%', marginBottom: '0.5rem' }}></div>
                    <div className="skeleton-text" style={{ width: '80%', height: '1.25rem' }}></div>
                    <div className="skeleton-text" style={{ width: '100%', marginTop: '0.5rem' }}></div>
                    <div className="skeleton-text" style={{ width: '90%' }}></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                      <div className="skeleton-text" style={{ width: '30%' }}></div>
                      <div className="skeleton-text" style={{ width: '35%', height: '2rem' }}></div>
                    </div>
                  </div>
                </div>
              ))
            : products.map((product, index) => (
                <div
                  key={product.id}
                  className="product-card"
                >
                  <div className="product-image-container">
                    <ProductImage src={product.primary_image} alt={product.name} index={index} />
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
                      <button className="btn btn-product">Add to Cart</button>
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
              ))}
        </div>
        {!isLoading && (
          <div className="view-more-container">
            <button
              onClick={() => navigate('/products')}
              className="btn btn-primary"
            >
              View More Products
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
