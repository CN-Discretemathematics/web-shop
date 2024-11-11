import { 
    collection,
    doc,
    setDoc,
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
  
  export const firestoreService = {
    // create doc
    async createDocument(collectionName, data, id = null) {
      try {
        const docRef = id 
          ? doc(db, collectionName, id)
          : doc(collection(db, collectionName));
        
        await setDoc(docRef, {
          ...data,
          createdAt: new Date()
        });
        
        return docRef.id;
      } catch (error) {
        console.error('Error creating document:', error);
        throw error;
      }
    },
  
    // scratch doc
    async getDocument(collectionName, id) {
      try {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() };
        }
        
        return null;
      } catch (error) {
        console.error('Error getting document:', error);
        throw error;
      }
    },
  
    // update doc
    async updateDocument(collectionName, id, data) {
      try {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, {
          ...data,
          updatedAt: new Date()
        });
      } catch (error) {
        console.error('Error updating document:', error);
        throw error;
      }
    },
  
    // delete doc
    async deleteDocument(collectionName, id) {
      try {
        const docRef = doc(db, collectionName, id);
        await deleteDoc(docRef);
      } catch (error) {
        console.error('Error deleting document:', error);
        throw error;
      }
    },
  
    // scratch collection
    async getCollection(collectionName, queryConstraints = []) {
      try {
        const q = query(collection(db, collectionName), ...queryConstraints);
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error('Error getting collection:', error);
        throw error;
      }
    }
  };