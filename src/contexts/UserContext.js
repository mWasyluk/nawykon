import { User } from '@models/user/User';
import { auth } from '@services/authService';
import { ModalService } from '@services/modalService';
import { UserService } from '@services/userService';
import { router } from 'expo-router';
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
                    setUser(new User({ ...userDetails, email: currentUser.email }));
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
        try {
            await UserService.logout();
            router.push('/');
        } catch (err) {
            ModalService.showError(err.message + " Odśwież aplikację i spróbuj ponownie.")
        }
    };

    const updateUsername = async (newUsername) => {
        setIsLoading(true);
        try {
            const userDto = { ...user, username: newUsername };
            delete userDto.email;

            const updatedUser = await UserService.updateUserDetails(userDto);
            setUser(new User({ ...updatedUser, email: user.email }));
        } catch (err) {
            ModalService.showError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <UserContext.Provider value={{ user, updateUsername, isLoading, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
