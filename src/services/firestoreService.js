import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, query, setDoc, where } from 'firebase/firestore';
import { db } from 'src/configs/firebaseConfig';
import { getCurrentUid } from './authService';

export const getAllDocuments = async (collectionName) => {
    return await getAllDocumentsByQuery(collectionName);
}

export const getAllDocumentsByQuery = async (collectionName, queryArgs = []) => {
    const uid = getCurrentUid();
    const finalQueryArgs = [...queryArgs, where('uid', '==', uid)];

    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...finalQueryArgs);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
};

export const getDocumentById = async (collectionName, id) => {
    getCurrentUid();

    const docRef = doc(db, collectionName, id);
    const doc = await getDoc(docRef);
    if (doc.exists()) {
        return { ...doc.data(), id: doc.id };
    }
    return null;
};

export const setDocument = async (collectionName, data) => {
    const uid = getCurrentUid();

    const docRefById = data.id ? doc(db, collectionName, data.id) : null;

    delete data.id;
    data.uid = uid;

    if (docRefById) {
        await setDoc(docRefById, JSON.parse(JSON.stringify(data)));
        return { ...data, id: docRefById.id };
    }

    const collectionRef = collection(db, collectionName);
    const docRef = await addDoc(collectionRef, JSON.parse(JSON.stringify(data)));
    return { ...data, id: docRef.id };
};

export const deleteDocument = async (collectionName, id) => {
    getCurrentUid();

    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
};

export const deleteAllDocuments = async (collectionName) => {
    getCurrentUid();

    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    await Promise.all(snapshot.docs.map(doc => deleteDoc(doc.ref)));
};

export const existByQuery = async (collectionName, queryArgs = []) => {
    const uid = getCurrentUid();
    const finalQueryArgs = [...queryArgs, where('uid', '==', uid), limit(1)];

    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...finalQueryArgs);
    const snapshot = await getDocs(q);
    return !snapshot.empty;
}
