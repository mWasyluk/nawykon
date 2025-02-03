import { collection, deleteDoc, doc, getDocs, query, setDoc } from 'firebase/firestore';
import db from 'src/configs/firebaseConfig';

export const getDocumentsByQuery = async (collectionName, queryArgs) => {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...queryArgs);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getDocumentById = async (collectionName, id) => {
    const docRef = doc(db, collectionName, id);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
        return { id: docSnapshot.id, ...docSnapshot.data() };
    }
    return null;
};

export const addDocument = async (collectionName, data) => {
    const docRef = doc(collection(db, collectionName));
    await setDoc(docRef, { ...data, id: docRef.id });
    return { id: docRef.id, ...data };
};

export const updateDocument = async (collectionName, id, data) => {
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, data, { merge: true });
    return { id, ...data };
};

export const deleteDocument = async (collectionName, id) => {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
};

export const deleteAllDocuments = async (collectionName) => {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    await Promise.all(snapshot.docs.map(doc => deleteDoc(doc.ref)));
};
