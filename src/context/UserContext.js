import { User } from '@models/user/User';
import { auth } from '@services/authService';
import { getAllDocuments } from '@services/firestoreService';
import ModalService from '@services/modalService';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
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
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            try {
                if (currentUser) {
                    const userDetails = await getUserDetails();
                    setUser(new User(userDetails));
                } else {
                    setUser(null);
                }
            } catch (err) {
                setError(new Error('Nie mogłem pobrać Twoich danych. Zaloguj się jeszcze raz.'));
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);

            const userDetails = await getUserDetails();
            setUser(new User(userDetails));
        } catch (err) {
            setError(new Error('Nie mogłem Cię zalogować. Sprawdź wprowadzone dane i spróbuj jeszcze raz.'));
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
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
