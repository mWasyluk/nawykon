import { Settings } from '@models/user/Settings';
import { User } from '@models/user/User';
import { auth } from '@services/authService';
import { ModalService } from '@services/modalService';
import { UserService } from '@services/userService';
import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(auth.currentUser?.uid ? { uid: auth.currentUser.uid } : null);
    const [settings, setSettings] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const updateSettings = async (newSettings) => {
        let updatedSettings = { ...settings, ...newSettings };
        try {
            updatedSettings = new Settings(updatedSettings);
        } catch (err) {
            console.error(err.message);
            ModalService.showError('Ustawienia są niepoprawne. Sprawdź wprowadzone dane i spróbuj ponownie.');
            return;
        }
        try {
            const savedSettings = await UserService.saveSettings(updatedSettings);
            setSettings(savedSettings);
        } catch (err) {
            ModalService.showError('Nie mogłem zapisać Twoich ustawień. Spróbuj ponownie później.');
        }
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            setIsLoading(true);
            try {
                if (currentUser) {
                    setUser(new User(currentUser));
                    setSettings(await UserService.getSettings());
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

    return (
        <UserContext.Provider value={{ user, settings, updateSettings, isLoading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
