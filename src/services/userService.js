import { createUserWithEmailAndPassword, deleteUser, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './authService';
import { Settings } from '@models/user/Settings';
import { deleteAllDocuments, deleteDocument, getAllDocuments, setDocument } from './firestoreService';

const settingsCollectionName = 'settings';

export const UserService = {
    login,
    logout,
    register,
    getSettings,
    saveSettings,
    deleteAccount,
}

async function login(email, password) {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        if (err.code === "auth/invalid-credential") {
            throw new Error("Taki użytkownik nie istnieje. Sprawdź wprowadzone dane i spróbuj ponownie.");
        }
        throw new Error("Nie mogłem Cię zalogować. Sprawdź połączenie z Internetem i spróbuj ponownie.");
    }
}

async function logout() {
    try {
        await signOut(auth);
    } catch {
        throw new Error("Nie mogłem Cię wylogować.")
    }
}

async function register(email, password) {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        // await sendEmailVerification(auth.currentUser);
    } catch (err) {
        if (err.code === "auth/email-already-in-use") {
            throw new Error("Taki użytkownik już istnieje. Wprowadź inny adres e-mail i spróbuj ponownie.");
        }
        throw new Error("Nie mogłem Cię zarejestrować. Sprawdź połączenie z Internetem i spróbuj ponownie.");
    }
}


async function getSettings() {
    const docs = await getAllDocuments(settingsCollectionName);
    if (!docs || docs.length === 0) {
        return new Settings({});
    }
    return new Settings(docs[0]);
}

async function saveSettings(settings) {
    const doc = await setDocument(settingsCollectionName, settings);
    return new Settings(doc);
}

async function deleteAccount() {
    await deleteAllDocuments(settingsCollectionName);
    await deleteUser(auth.currentUser);
}
