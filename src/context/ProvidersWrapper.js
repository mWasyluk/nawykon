import { HabitsProvider } from './HabitsContext';
import { DailyReportsProvider } from './ReportsContext';
import { StateManagerProvider } from './StateManagerContext';
import { UserProvider } from './UserContext';

export default function ProvidersWrapper({ children }) {
    return (
        <UserProvider>
            <HabitsProvider>
                <DailyReportsProvider>
                    <StateManagerProvider>
                        {children}
                    </StateManagerProvider>
                </DailyReportsProvider>
            </HabitsProvider>
        </UserProvider>
    );
};
