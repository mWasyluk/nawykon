import React from 'react';
import { UserProvider } from './UserContext';
import { HabitsProvider } from './HabitsContext';
import { ReportsProvider } from './ReportsContext';
import { StateManagerProvider } from './StateManagerContext';

export default function DataProviders({ children }) {
    return (
        <UserProvider>
            <HabitsProvider>
                <ReportsProvider>
                    <StateManagerProvider>
                        {children}
                    </StateManagerProvider>
                </ReportsProvider>
            </HabitsProvider>
        </UserProvider>
    );
};
