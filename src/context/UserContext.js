import { User } from '@models/user/User';
import { auth } from '@services/authService';
import { ModalService } from '@services/modalService';
import { UserService } from '@services/userService';
import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(auth.currentUser?.uid ? { uid: auth.currentUser.uid } : null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            try {
                if (currentUser) {
                    setIsLoading(true);
                    const userDetails = await UserService.getUserDetails(); // uid, username, prefs
                    setUser(new User(userDetails));
                } else {
                    setUser(null);
                }
            } catch (err) {
                setUser(null);
                ModalService.showError('Nie mogłem pobrać Twoich danych. Zaloguj się jeszcze raz.');
            } finally {
                setIsLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            await UserService.login(email, password);
        } catch (err) {
            ModalService.showError(err.message)
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await UserService.logout();
        } catch (err) {
            ModalService.showError(err.message + " Odśwież aplikację i spróbuj ponownie.")
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <UserContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
