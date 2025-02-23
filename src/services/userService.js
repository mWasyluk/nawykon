import { getAllDocumentsByQuery } from '@services/firestoreService';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { limit } from 'firebase/firestore';
import { auth } from './authService';

const collectionName = 'userDetails';

export const UserService = {
    getUserDetails,
    login,
    logout,
}

async function getUserDetails() {
    const userDetails = await getAllDocumentsByQuery(collectionName, [limit(1)]);
    return userDetails[0];
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
