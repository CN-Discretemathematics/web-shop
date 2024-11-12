import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const ProductDetail = ({ onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('product does not exist');
        }
      } catch (err) {
        setError('Failed to fetch product info');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    onAddToCart?.({ ...product, quantity });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          return
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* image */}
        <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
          <img
            src={product.imageUrl || '/placeholder-image.jpg'}
            alt={product.name}
            className="w-full h-full object-center object-cover"
          />
        </div>

        {/* info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="mt-2 text-sm text-gray-500 capitalize">{product.category}</p>
          </div>

          <div className="text-3xl font-bold text-blue-600">
            ¥{product.price.toFixed(2)}
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">description</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">stock</h3>
            <p className="text-gray-700">
              {product.stock > 0 ? `storage: ${product.stock} st` : 'out of stock'}
            </p>
          </div>

          {product.stock > 0 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  number
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm 
                           focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full md:w-auto px-6 py-3 text-base font-medium text-white 
                         bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none 
                         focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                add to cart
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="mt-8 text-blue-600 hover:text-blue-800"
      >
        return
      </button>
    </div>
  );
};

export default ProductDetail;