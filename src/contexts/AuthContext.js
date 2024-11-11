// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth,
  db  
} from '../firebase/config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';

const AuthContext = createContext({
  currentUser: null,
  register: async () => {},
  login: async () => {},
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  async function createUserDocument(user, additionalData = {}) {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const userData = {
        email: user.email,
        createdAt: serverTimestamp(),
        role: 'user', // default
        ...additionalData
      };

      try {
        await setDoc(userRef, userData);
        console.log('User document created successfully');
      } catch (error) {
        console.error('Error creating user document:', error);
      }
    }

    return userRef;
  }

  
  async function register(email, password, additionalData = {}) {
    try {
      // 1. create verification user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. create userdoc in firestore
      await createUserDocument(user, additionalData);

      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

 
  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        // used to deal with users' data
        console.log('User document data:', userDoc.data());
      }

      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  
  async function logout() {
    return signOut(auth);
  }

  // listen user status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // get user firestore doc
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setCurrentUser({ ...user, ...userDoc.data() });
        } else {
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}