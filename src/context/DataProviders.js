import React from 'react';
import { UserProvider } from './UserContext';
import { HabitsProvider } from './HabitsContext';
import { ReportsProvider } from './ReportsContext';

export default function DataProviders({ children }) {
    return (
        <UserProvider>
            <HabitsProvider>
                <ReportsProvider>
                    {children}
                </ReportsProvider>
            </HabitsProvider>
        </UserProvider>
    );
};
