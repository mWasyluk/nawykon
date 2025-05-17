import { createContext, useContext, useState } from 'react';
import { ActivityProvider } from './ActivitiesContext';
import { FontsProvider } from './FontsContext';
import { HabitsProvider } from './HabitsContext';
import { NotificationsProvider } from './NotificationsContext';
import { DailyReportsProvider } from './ReportsContext';
import { SettingsProvider } from './SettingsContext';

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
                            <ActivityProvider key={`activities-${key}`}>
                                <NotificationsProvider key={`notifications-${key}`}>
                                    {children}
                                </NotificationsProvider>
                            </ActivityProvider>
                        </DailyReportsProvider>
                    </HabitsProvider>
                </SettingsProvider>
            </FontsProvider>
        </ResetContext.Provider>
    );
};
