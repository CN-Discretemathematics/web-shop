import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, onSnapshot, query, where, getDoc, doc } from 'firebase/firestore';

export const useCart = (userId) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    const cartRef = collection(db, 'carts', userId, 'items');
    
    const unsubscribe = onSnapshot(cartRef, 
      async (snapshot) => {
        try {
          const items = [];
          for (const document of snapshot.docs) {
            const productRef = doc(db, 'products', document.data().productId);
            const productSnap = await getDoc(productRef);
            
            if (productSnap.exists()) {
              items.push({
                id: document.id,
                quantity: document.data().quantity,
                product: { id: productSnap.id, ...productSnap.data() }
              });
            }
          }
          setCartItems(items);
          setLoading(false);
        } catch (err) {
          setError(err);
          setLoading(false);
        }
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { cartItems, loading, error };
};