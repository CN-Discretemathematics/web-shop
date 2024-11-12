import React, { useState, useCallback, useEffect } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { debounce } from 'lodash';

const ProductSearch = ({ onSearch, onClear }) => {
  const { searchProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useCallback(
    (term, cat) => {
      const searchFn = async () => {
        setLoading(true);
        try {
          const results = await searchProducts(term, cat);
          onSearch(results);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setLoading(false);
        }
      };
      
      return debounce(searchFn, 300);
    },
    [searchProducts, onSearch, setLoading]
  );

  useEffect(() => {
    if (searchTerm || category) {
      const debouncedFn = debouncedSearch(searchTerm, category);
      debouncedFn();
      return () => {
        debouncedFn.cancel();
      };
    }
  }, [searchTerm, category, debouncedSearch]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (!value && !category) {
      handleClear();
      return;
    }
    
    debouncedSearch(value, category);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);
    debouncedSearch(searchTerm, value);
  };

  const handleClear = () => {
    setSearchTerm('');
    setCategory('');
    onClear();
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            search product
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="enter name or description..."
              className="block w-full rounded-md border-gray-300 shadow-sm 
                       focus:border-blue-500 focus:ring-blue-500"
            />
            {loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            category
          </label>
          <select
            value={category}
            onChange={handleCategoryChange}
            className="block w-full rounded-md border-gray-300 shadow-sm 
                     focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">all category</option>
            <option value="electronics">electronics</option>
            <option value="clothing">clothing</option>
            <option value="books">books</option>
            <option value="food">food</option>
            <option value="other">other</option>
          </select>
        </div>
      </div>

      {(searchTerm || category) && (
        <div className="flex justify-end">
          <button
            onClick={handleClear}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            clear
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;