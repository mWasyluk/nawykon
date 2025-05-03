import { ModalService } from '@services/modalService';
import { SettingsService } from '@services/settingsService';
import { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const adaptToPlatform = (settings) => {
        if (isWeb && settings?.notificationsEnabled) {
            ModalService.showError("Powiadomienia nie są dostępne w wersji przeglądarkowej.");
            return {
                ...settings,
                notificationsEnabled: false,
            };
        }
        return settings;
    }

    const updateSettings = async (newSettings) => {
        setIsLoading(true);
        try {
            newSettings = adaptToPlatform(newSettings);
            const updatedSettings = await SettingsService.save({ ...settings, ...newSettings });
            setSettings(updatedSettings);
            return updatedSettings;
        } catch (err) {
            console.error(err);
            ModalService.showError("Nie udało się zaktualizować ustawień. Odśwież aplikację i spróbuj ponownie.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const userSettings = await SettingsService.get();
                setSettings(adaptToPlatform(userSettings));
            } catch (err) {
                ModalService.showError("Nie udało się pobrać ustawień. Odśwież aplikację i spróbuj ponownie.");
            }
        }

        fetchSettings();
        setIsLoading(false);

        return () => {
            setSettings(null);
        };
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, isLoading }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);
