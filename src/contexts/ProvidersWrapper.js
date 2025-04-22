import { FontsProvider } from './FontsContext';
import { HabitsProvider } from './HabitsContext';
import { NotificationsProvider } from './NotificationsContext';
import { DailyReportsProvider } from './ReportsContext';
import { StateManagerProvider } from './StateManagerContext';
import { UserProvider } from './UserContext';

export default function ProvidersWrapper({ children }) {
    return (
        <FontsProvider>
            <UserProvider>
                <HabitsProvider>
                    <DailyReportsProvider>
                        <NotificationsProvider>
                            <StateManagerProvider>
                                {children}
                            </StateManagerProvider>
                        </NotificationsProvider>
                    </DailyReportsProvider>
                </HabitsProvider>
            </UserProvider>
        </FontsProvider>
    );
};
