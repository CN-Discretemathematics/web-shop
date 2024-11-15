import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from './ProductCard';
import ProductSearch from './ProductSearch';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { addToCart } from '../../firebase/cart';
import toast from 'react-hot-toast';


const ProductList = () => {
  const navigate = useNavigate();
  const {user} = useAuth();
  const { products, loading, error } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);

  const displayProducts = isFiltering ? filteredProducts : products;

  const handleAddToCart = async (product) => {
    if (!user){
      return navigate('/login',{
        state:{from:'/products'}
      });
    }

    try{
      await addToCart(user.uid, product.id, 1);
      toast.success(`${product.name} added to cart`);
    }catch(error){
      toast.error('Failed to add to cart');
      console.error('Error: ',error);
    }
  };

  const handleSearch = (results) => {
    setFilteredProducts(results);
    setIsFiltering(true);
  };

  const clearSearch = () => {
    setFilteredProducts([]);
    setIsFiltering(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProductSearch onSearch={handleSearch} onClear={clearSearch} />
      
      {displayProducts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {isFiltering ? 'no related product' : 'we donot have'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => handleAddToCart(product)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;