import React, { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import AdminProductForm from '../../components/Products/AdminProductForm';
import ProductCard from '../../components/Products/ProductCard';


const ProductManagement = () => {
  const { products, loading, error, deleteProduct } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const handleSuccess = () => {
    setShowForm(false);
    setSelectedProduct(null);
    setActionMessage('success！');
    setTimeout(() => setActionMessage(''), 3000);
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('are you sure to delete？')) {
      try {
        await deleteProduct(productId);
        setActionMessage('deleted！');
        setTimeout(() => setActionMessage(''), 3000);
      } catch (err) {
        setActionMessage('failed to delete：' + err.message);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">product management</h1>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          add new product
        </button>
      </div>

      {actionMessage && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {selectedProduct ? 'manage product' : 'add new product'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setSelectedProduct(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                close
              </button>
            </div>
            <AdminProductForm
              product={selectedProduct}
              onSuccess={handleSuccess}
              onCancel={() => {
                setShowForm(false);
                setSelectedProduct(null);
              }}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          no product,please add
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product.id} className="relative group">
              <ProductCard product={product} />
              <div className="absolute top-2 right-2 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(product)}
                  className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductManagement;