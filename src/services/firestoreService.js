import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, limit, query, setDoc, where } from 'firebase/firestore';
import { db } from 'src/configs/firebaseConfig';
import { auth } from './authService';

function verifyUid() {
    const uid = auth.currentUser?.uid;
    if (!uid) {
        throw new Error("Ta akcja wymaga ponownego zalogowania się.");
    }
    return uid;
}

export const getAllDocuments = async (collectionName) => {
    return await getAllDocumentsByQuery(collectionName);
}

export const getAllDocumentsByQuery = async (collectionName, queryArgs = []) => {
    const uid = verifyUid();
    try {
        const finalQueryArgs = [...queryArgs, where('uid', '==', uid)];

        const collectionRef = collection(db, collectionName);
        const q = query(collectionRef, ...finalQueryArgs);
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    } catch (error) {
        throw new Error("Nie udało się pobrać danych z serwera.");
    }
};

export const getDocumentById = async (collectionName, id) => {
    verifyUid();

    try {
        const docRef = doc(db, collectionName, id);
        const doc = await getDoc(docRef);
        if (doc.exists()) {
            return { ...doc.data(), id: doc.id };
        }
        return null;
    } catch (error) {
        throw new Error("Nie udało się pobrać danych z serwera.");
    }
};

export const setDocument = async (collectionName, data) => {
    const uid = verifyUid();

    try {
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
    } catch (error) {
        throw new Error("Nie udało się zapisać danych na serwerze.");
    }
};

export const deleteDocument = async (collectionName, id) => {
    verifyUid();

    try {
        const docRef = doc(db, collectionName, id);
        await deleteDoc(docRef);
    } catch (error) {
        throw new Error("Nie udało się usunąć danych z serwera.");
    }
};

export const deleteAllDocuments = async (collectionName) => {
    const uid = verifyUid();

    try {
        const collectionRef = collection(db, collectionName);
        const q = query(collectionRef, where('uid', '==', uid));
        const snapshot = await getDocs(q);
        await Promise.all(snapshot.docs.map(doc => deleteDoc(doc.ref)));
    } catch (error) {
        throw new Error("Nie udało się usunąć danych z serwera.");
    }
};

export const existByQuery = async (collectionName, queryArgs = []) => {
    const uid = verifyUid();

    try {
        const finalQueryArgs = [...queryArgs, where('uid', '==', uid), limit(1)];

        const collectionRef = collection(db, collectionName);
        const q = query(collectionRef, ...finalQueryArgs);
        const snapshot = await getDocs(q);
        return !snapshot.empty;
    } catch (error) {
        throw new Error("Nie udało się sprawdzić danych na serwerze.");
    }
}
