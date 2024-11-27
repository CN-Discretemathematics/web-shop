// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '../firebase/config';
import{
    doc,
    setDoc,
    getDoc,serverTimestamp
} from 'firebase/firestore';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  //create user doc
  const createUserDocument = async (user, additionalData={})=>{
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()){
        const userData={
            email: user.email,
            createdAt:serverTimestamp(),
            role: 'user',
            ...additionalData
        };

        try {
            await setDoc(userRef, userData);
            console.log('User document created successfully');
        }catch (error){
            console.error('Error creating user document:',error);
            throw error;
        }
    }
    return userRef;
  };

  // listen user status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // 获取用户的 Firestore 文档
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUser({ ...user, ...userDoc.data() });
        } else {
          setUser(user);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  //sign up
  const signUp = async (email, password,additionalData={}) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await createUserDocument(user, additionalData);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // sign in
  const signIn = async (email, password) => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if(userDoc.exists()){
        console.log('User document data:',userDoc.data());
      }
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // sign out
  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
      setUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // resetpassword
  const resetPassword = async (email) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // update information
  const updateUserProfile = async (displayName, photoURL) => {
    try {
      setError(null);
      if (user) {
        await updateProfile(user, {
          displayName: displayName || user.displayName,
          photoURL: photoURL || user.photoURL
        });
        // force refresh
        setUser({ ...user });
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateUserProfile,
    isAuthenticated: !!user
  };
};