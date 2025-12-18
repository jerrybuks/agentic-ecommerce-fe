import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import type { ProductFilters } from '../services/api';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    page_size: pageSize,
    is_active: true,
    search: null,
    category: null,
    brand: null,
    min_price: null,
    max_price: null,
    tags: null,
  });

  // Use TanStack Query for data fetching with caching
  const { data, isLoading, isFetching, isError, error, refetch } = useProducts({
    ...filters,
    page: currentPage,
    page_size: pageSize,
    is_active: true,
  });

  const products = data?.products ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  const handleSearch = (searchTerm: string) => {
    setFilters((prev) => ({ ...prev, search: searchTerm || null }));
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Use instant scroll instead of smooth to avoid interference with page updates
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Show loading skeleton only on initial load
  const showSkeleton = isLoading;



  return (
    <div
      className="products-page"
      style={{
        backgroundColor: '#ffffff',
        width: '100%',
        minHeight: '100vh',
        display: 'block',
      }}
    >
      <Navbar />
      <div className="container">
        <h1 className="page-title">
          All Products
          {isFetching && !isLoading && (
            <span className="loading-indicator" aria-label="Loading">
              {' '}
              ⏳
            </span>
          )}
        </h1>

        <div className="products-page-layout">
          <aside className="filters-sidebar">
            <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
          </aside>

          <main className="products-main">
            <SearchBar onSearch={handleSearch} />

            {showSkeleton ? (
              <div className="products-grid">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="product-card skeleton">
                    <div className="product-image-container">
                      <div className="product-image-placeholder"></div>
                    </div>
                    <div className="product-info">
                      <div
                        className="skeleton-text"
                        style={{ width: '40%', marginBottom: '0.5rem' }}
                      ></div>
                      <div
                        className="skeleton-text"
                        style={{ width: '80%', height: '1.25rem' }}
                      ></div>
                      <div
                        className="skeleton-text"
                        style={{ width: '100%', marginTop: '0.5rem' }}
                      ></div>
                      <div className="skeleton-text" style={{ width: '90%' }}></div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginTop: '1rem',
                        }}
                      >
                        <div className="skeleton-text" style={{ width: '30%' }}></div>
                        <div
                          className="skeleton-text"
                          style={{ width: '35%', height: '2rem' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="error-message">
                <p>⚠️ {error instanceof Error ? error.message : 'Failed to load products'}</p>
                <button onClick={() => refetch()} className="btn btn-primary">
                  Retry
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="no-products">
                <p>No products found. Try adjusting your filters.</p>
              </div>
            ) : (
              <>
                <div className="products-results-info">
                  <p>
                    Showing {products.length} of {total} products
                  </p>
                </div>
                <div className={`products-grid ${isFetching ? 'fetching' : ''}`}>
                  {products.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      style={{ animationDelay: `${index * 30}ms` }}
                    />
                  ))}
                </div>

                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn btn-secondary pagination-prev"
                  >
                    ← Previous
                  </button>
                  
                  <span className="pagination-info">
                    {currentPage}/{totalPages}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="btn btn-secondary pagination-next"
                  >
                    Next →
                  </button>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
