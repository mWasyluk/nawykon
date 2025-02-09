import React from 'react';
import { UserProvider } from './UserContext';
import { HabitsProvider } from './HabitsContext';
import { DailyReportsProvider } from './ReportsContext';
import { StateManagerProvider } from './StateManagerContext';

export default function DataProviders({ children }) {
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
