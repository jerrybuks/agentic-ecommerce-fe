import { useState, useEffect } from 'react';
import type { ProductFilters } from '../services/api';

interface FilterPanelProps {
  filters: ProductFilters;
  onFilterChange: (filters: Partial<ProductFilters>) => void;
}

export default function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState({
    category: filters.category || '',
    brand: filters.brand || '',
    min_price: filters.min_price?.toString() || '',
    max_price: filters.max_price?.toString() || '',
    tags: filters.tags || '',
  });

  useEffect(() => {
    setLocalFilters({
      category: filters.category || '',
      brand: filters.brand || '',
      min_price: filters.min_price?.toString() || '',
      max_price: filters.max_price?.toString() || '',
      tags: filters.tags || '',
    });
  }, [filters]);

  const handleChange = (field: string, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    onFilterChange({
      category: localFilters.category || null,
      brand: localFilters.brand || null,
      min_price: localFilters.min_price ? parseFloat(localFilters.min_price) : null,
      max_price: localFilters.max_price ? parseFloat(localFilters.max_price) : null,
      tags: localFilters.tags || null,
    });
  };

  const handleClear = () => {
    setLocalFilters({
      category: '',
      brand: '',
      min_price: '',
      max_price: '',
      tags: '',
    });
    onFilterChange({
      category: null,
      brand: null,
      min_price: null,
      max_price: null,
      tags: null,
    });
  };

  const hasActiveFilters = 
    localFilters.category ||
    localFilters.brand ||
    localFilters.min_price ||
    localFilters.max_price ||
    localFilters.tags;

  return (
    <div className="filter-panel">
      <h3 className="filter-title">Filters</h3>
      
      <div className="filter-group">
        <label htmlFor="category" className="filter-label">
          Category
        </label>
        <input
          type="text"
          id="category"
          value={localFilters.category}
          onChange={(e) => handleChange('category', e.target.value)}
          placeholder="e.g., Electronics"
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="brand" className="filter-label">
          Brand
        </label>
        <input
          type="text"
          id="brand"
          value={localFilters.brand}
          onChange={(e) => handleChange('brand', e.target.value)}
          placeholder="e.g., Apple"
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="min_price" className="filter-label">
          Min Price
        </label>
        <input
          type="number"
          id="min_price"
          value={localFilters.min_price}
          onChange={(e) => handleChange('min_price', e.target.value)}
          placeholder="0"
          min="0"
          step="0.01"
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="max_price" className="filter-label">
          Max Price
        </label>
        <input
          type="number"
          id="max_price"
          value={localFilters.max_price}
          onChange={(e) => handleChange('max_price', e.target.value)}
          placeholder="1000"
          min="0"
          step="0.01"
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="tags" className="filter-label">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          id="tags"
          value={localFilters.tags}
          onChange={(e) => handleChange('tags', e.target.value)}
          placeholder="e.g., gaming, wireless"
          className="filter-input"
        />
      </div>

      <div className="filter-actions">
        <button onClick={handleApply} className="btn btn-primary">
          Apply Filters
        </button>
        {hasActiveFilters && (
          <button onClick={handleClear} className="btn btn-secondary">
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}

