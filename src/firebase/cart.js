import { db } from './config';
import { 
  doc, 
  collection, 
  updateDoc, 
  deleteDoc, 
  setDoc, 
  getDoc,
  increment 
} from 'firebase/firestore';

export const addToCart = async (userId, productId, quantity) => {
  try {
    const cartItemRef = doc(db, 'carts', userId, 'items', productId);
    const cartItemSnap = await getDoc(cartItemRef);
    
    if (cartItemSnap.exists()) {
      // Update quantity if item exists
      await updateDoc(cartItemRef, {
        quantity: increment(quantity)
      });
    } else {
      // Add new item if it doesn't exist
      await setDoc(cartItemRef, {
        productId,
        quantity
      });
    }
    return true;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const removeFromCart = async (userId, productId) => {
  try {
    const cartItemRef = doc(db, 'carts', userId, 'items', productId);
    await deleteDoc(cartItemRef);
    return true;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

export const updateCartItemQuantity = async (userId, productId, quantity) => {
  try {
    const cartItemRef = doc(db, 'carts', userId, 'items', productId);
    await updateDoc(cartItemRef, {
      quantity: quantity
    });
    return true;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};