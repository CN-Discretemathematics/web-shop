// src/firebase/auth.js
import { auth, db } from './config';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const authService = {
  // register
  async register(email, password, userData) {
    try {
      // create verification users
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // create user doc
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        name: userData.name,
        role: 'user',
        createdAt: new Date(),
        ...userData
      });

      return user;
    } catch (error) {
      console.error('Error in registration:', error);
      throw error;
    }
  },

  // login
  async login(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  },

  // logout
  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error in logout:', error);
      throw error;
    }
  },

  // reset
  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error in password reset:', error);
      throw error;
    }
  },

  // scratch current user doc
  async getCurrentUser() {
    const user = auth.currentUser;
    if (!user) return null;

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    return userDoc.exists() ? { ...userDoc.data(), uid: user.uid } : null;
  }
};

