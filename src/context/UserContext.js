import { User } from '@models/user/User';
import { getAllDocuments } from '@services/firestoreService';
import ModalService from '@services/modalService';
import { storeService } from '@services/storeService';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from 'src/configs/firebaseConfig';
import LoginScreen from 'src/screens/login';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const getUserDetails = async () => {
        const userDetails = await getAllDocuments('userDetails').then((docs) => docs[0]);
        return userDetails;
    }

    useEffect(() => {
        const checkUidAndSetUserIfExists = async () => {
            try {
                const uid = await storeService.getItem('uid', true);
                if (uid) {
                    const userDetails = await getUserDetails();
                    setUser(new User(userDetails));
                } else {
                    setUser(null);
                }
            } catch (err) {
                setError(new Error('Nie mogłem pobrać Twoich danych. Zaloguj się jeszcze raz.'));
                await storeService.removeItem('uid', true);
            } finally {
                setIsLoading(false);
            }
        };

        checkUidAndSetUserIfExists();
    }, []);

    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;
            await storeService.setItem('uid', uid, true);

            const userDetails = await getUserDetails();
            setUser(new User(userDetails));
        } catch (err) {
            setError(new Error('Nie mogłem Cię zalogować. Sprawdź wprowadzone dane i spróbuj jeszcze raz.'));
        }
    };

    const logout = async () => {
        try {
            await storeService.removeItem('uid', true);
            await signOut(auth);
            setUser(null);
        } catch (err) {
            setError(new Error('Nie mogłem Cię wylogować. Spróbuj jeszcze raz.'));
        }
    };

    useEffect(() => {
        if (error) {
            ModalService.showError(error.message);
            setError(null);
        }
    }, [error]);

    if (!isLoading && !user) {
        return (
            <LoginScreen login={login} />
        );
    }

    return (
        <UserContext.Provider value={{ user, isLoading, error, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
