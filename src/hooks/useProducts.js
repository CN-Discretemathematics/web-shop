import { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 获取所有产品
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products!');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // 添加产品
  const addProduct = async (productData) => {
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...productData,
        createdAt: new Date().toISOString()
      });

      const newProduct = {
        id: docRef.id,
        ...productData
      };

      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (err) {
      setError('Failed to add product!');
      console.error('Error adding product:', err);
      throw err;
    }
  };

  // 更新产品
  const updateProduct = async (productId, updateData) => {
    try {
      const productRef = doc(db, 'products', productId);
      const updatedData = {
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(productRef, updatedData);

      setProducts(prev =>
        prev.map(product =>
          product.id === productId
            ? { ...product, ...updatedData }
            : product
        )
      );

      return { id: productId, ...updatedData };
    } catch (err) {
      setError('Failed to update product!');
      console.error('Error updating product:', err);
      throw err;
    }
  };

  // 删除产品
  const deleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
      setProducts(prev => prev.filter(product => product.id !== productId));
    } catch (err) {
      setError('Failed to delete product!');
      console.error('Error deleting product:', err);
      throw err;
    }
  };

  // 搜索产品
  const searchProducts = async (searchTerm, category) => {
    try {
      setLoading(true);
      let q = collection(db, 'products');

      if (category) {
        q = query(q, where('category', '==', category));
      }

      const querySnapshot = await getDocs(q);
      let results = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        results = results.filter(product =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
        );
      }

      return results;
    } catch (err) {
      setError('Failed to search product!');
      console.error('Error searching products:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProducts
  };
};