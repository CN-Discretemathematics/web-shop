import { 
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit
  } from 'firebase/firestore';
  import { db } from './config';
  
  export const productService = {
    // create product using url
    async createProduct(productData) {
      try {
        const productsRef = collection(db, 'products');
        const docRef = await addDoc(productsRef, {
          ...productData,
          createdAt: new Date()
        });
        return docRef.id;
      } catch (error) {
        console.error('Error creating product:', error);
        throw error;
      }
    },
  
    // get procuct lists
    async getProducts(options = {}) {
      try {
        const { category, limit: limitCount = 20, page = 1 } = options;
        
        let q = query(
          collection(db, 'products'),
          orderBy('createdAt', 'desc')
        );
  
        if (category) {
          q = query(q, where('category', '==', category));
        }
  
        if (limitCount) {
          q = query(q, limit(limitCount));
        }
  
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error getting products:', error);
        throw error;
      }
    },
  
    // update product
    async updateProduct(productId, productData) {
      try {
        const productRef = doc(db, 'products', productId);
        await updateDoc(productRef, {
          ...productData,
          updatedAt: new Date()
        });
      } catch (error) {
        console.error('Error updating product:', error);
        throw error;
      }
    },
  
    // delete product
    async deleteProduct(productId) {
      try {
        const productRef = doc(db, 'products', productId);
        await deleteDoc(productRef);
      } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
      }
    }
  };