import { Statistics } from "@models/reports/Statistics";
import { ModalService } from '@services/modalService';
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import AuthScreen from "src/screens/auth/AuthScreen";
import LoadingScreen from "src/screens/loading/LoadingScreen";
import { useFonts } from './FontsContext';
import { useHabits } from "./HabitsContext";
import { useReports } from "./ReportsContext";
import { useUser } from "./UserContext";

const StateManagerContext = createContext({ isReady: false });

export function StateManagerProvider({ children }) {
    const { isLoading: isFontsLoading } = useFonts();
    const { isLoading: isUserLoading, user } = useUser();
    const { isLoading: isHabitsLoading, habits } = useHabits();
    const { isLoading: isReportsLoading, dailyReports } = useReports();

    const [statistics, setStatistics] = useState(null);
    const [content, setContent] = useState(<AuthScreen />);

    const loadingMessage = useMemo(() => {
        if (isUserLoading || isHabitsLoading || isReportsLoading || isFontsLoading) {
            return 'Pobieram dane' +
                (isUserLoading ? ' o użytkowniku'
                    : isFontsLoading ? ' o czcionkach'
                        : isHabitsLoading ? ' o nawykach'
                            : isReportsLoading ? ' o raportach'
                                : '') + '...';
        } else if (!statistics) {
            return 'Tworzę statystyki...';
        }
        return '';
    }, [isUserLoading, isHabitsLoading, isReportsLoading, isFontsLoading, statistics]);

    useEffect(() => {
        if (!dailyReports || !habits) {
            return;
        }

        try {
            var stats = statistics;
            if (stats === null) {
                stats = new Statistics(dailyReports, habits);
            } else {
                stats = statistics.clone();
                stats.update(dailyReports, habits);
            }
            setStatistics(stats);
        } catch (err) {
            ModalService.showError('Nie mogłem wygenerować statystyk. Odśwież aplikację, żebym mógł spróbować jeszcze raz.');
        }
    }, [dailyReports, habits]);

    const currentState = useMemo(() => {
        if (!user && !isUserLoading) {
            return "AUTH";
        }
        if (statistics && !loadingMessage) {
            return "READY";
        }
        return "LOADING";
    }, [statistics, loadingMessage, user]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentState === "AUTH") {
                setContent(<AuthScreen />);
            } else if (currentState === "READY") {
                setContent(children);
            } else {
                setContent(null);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [currentState]);

    return (
        <StateManagerContext.Provider value={{ statistics }}>
            <LoadingScreen show={currentState === "LOADING"} message={loadingMessage}></LoadingScreen>
            {content}
        </StateManagerContext.Provider>
    );
}

export const useStateManager = () => useContext(StateManagerContext);
