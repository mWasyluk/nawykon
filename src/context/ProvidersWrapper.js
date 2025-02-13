import React from 'react';
import { UserProvider } from './UserContext';
import { HabitsProvider } from './HabitsContext';
import { DailyReportsProvider } from './ReportsContext';
import { StateManagerProvider } from './StateManagerContext';
import { ModalProvider } from './ModalContext';

export default function ProvidersWrapper({ children }) {
    return (
        <ModalProvider>
            <UserProvider>
                <HabitsProvider>
                    <DailyReportsProvider>
                        <StateManagerProvider>
                            {children}
                        </StateManagerProvider>
                    </DailyReportsProvider>
                </HabitsProvider>
            </UserProvider>
        </ModalProvider>
    );
};
