import { FontsProvider } from './FontsContext';
import { HabitsProvider } from './HabitsContext';
import { NotificationsProvider } from './NotificationsContext';
import { DailyReportsProvider } from './ReportsContext';
import { StateManagerProvider } from './StateManagerContext';
import { SettingsProvider } from './SettingsContext';
import { createContext, useContext, useState } from 'react';

const ResetContext = createContext();

export const useReset = () => useContext(ResetContext);

export default function ProvidersWrapper({ children }) {
    const [key, setKey] = useState(0);

    const resetApp = () => {
        setKey(prevKey => prevKey + 1);
    };

    return (
        <ResetContext.Provider value={{ resetApp }}>
            <FontsProvider key={`fonts-${key}`}>
                <SettingsProvider key={`settings-${key}`}>
                    <HabitsProvider key={`habits-${key}`}>
                        <DailyReportsProvider key={`reports-${key}`}>
                            <NotificationsProvider key={`notifications-${key}`}>
                                <StateManagerProvider key={`state-${key}`}>
                                    {children}
                                </StateManagerProvider>
                            </NotificationsProvider>
                        </DailyReportsProvider>
                    </HabitsProvider>
                </SettingsProvider>
            </FontsProvider>
        </ResetContext.Provider>
    );
};
