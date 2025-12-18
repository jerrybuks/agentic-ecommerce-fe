import { useState, type FormEvent } from 'react';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search products by name, description, or SKU..."
        className="search-input"
      />
      <div className="search-actions">
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="btn btn-secondary"
          >
            Clear
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </div>
    </form>
  );
}

