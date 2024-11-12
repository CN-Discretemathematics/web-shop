import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart }) => {
  const { id, name, price, imageUrl, stock, category } = product;

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/products/${id}`}>
        <div className="h-48 overflow-hidden">
          <img
            src={imageUrl || '/placeholder-image.jpg'}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <Link 
          to={`/products/${id}`}
          className="text-lg font-semibold text-gray-800 hover:text-blue-600 line-clamp-2"
        >
          {name}
        </Link>
        
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">
            ¥{price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500 capitalize">
            {category}
          </span>
        </div>
        
        <div className="mt-2 text-sm text-gray-500">
          stock: {stock} st
        </div>
      </div>

      <div className="p-4 pt-0">
        <button
          onClick={() => onAddToCart?.(product)}
          disabled={stock < 1}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md 
                    hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                    transition-colors duration-200"
        >
          {stock < 1 ? 'out of stock' : 'add to cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;