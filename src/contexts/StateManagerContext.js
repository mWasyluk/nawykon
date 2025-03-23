import { ActivityRegistry } from "@models/reports/ActivityRegistry";
import AuthScreen from "@screens/commons/auth/AuthScreen";
import LoadingScreen from "@screens/commons/auth/LoadingScreen";
import { ModalService } from "@services/modalService";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useFonts } from "./FontsContext";
import { useHabits } from "./HabitsContext";
import { useReports } from "./ReportsContext";
import { useUser } from "./UserContext";

const StateManagerContext = createContext({ activityRegistry: null });

export function StateManagerProvider({ children }) {
    const { isLoading: isFontsLoading } = useFonts();
    const { isLoading: isUserLoading, user } = useUser();
    const { isLoading: isHabitsLoading, habits } = useHabits();
    const { isLoading: isReportsLoading, dailyReports } = useReports();

    const [activityRegistry, setActivityRegistry] = useState(null);
    const [content, setContent] = useState(<AuthScreen />);

    const loadingMessage = useMemo(() => {
        if (isFontsLoading){
            return '';
        }
        if (isUserLoading || isHabitsLoading || isReportsLoading) {
            return 'Pobieram dane' +
                (isUserLoading ? ' o użytkowniku'
                        : isHabitsLoading ? ' o nawykach'
                            : isReportsLoading ? ' o raportach'
                                : '') + '...';
        } 
        if (!activityRegistry) {
            return 'Tworzę rejestr aktywności...';
        }
        return '';
    }, [isUserLoading, isHabitsLoading, isReportsLoading, isFontsLoading, activityRegistry]);

    useEffect(() => {
        if (!dailyReports || !habits) {
            return;
        }

        try {
            let registry = activityRegistry;
            if (!registry) {
                registry = new ActivityRegistry(dailyReports, habits);
            } else {
                const isUpdated = registry.update(dailyReports, habits);
                if (isUpdated) {
                    registry = registry.clone();
                }
            }
            setActivityRegistry(registry);
        } catch (err) {
            console.error(err);
            ModalService.showError('Nie mogłem wygenerować rejestru aktywności. Odśwież aplikację, żebym mógł spróbować jeszcze raz.');
        }
    }, [dailyReports, habits]);

    const currentState = useMemo(() => {
        if (!user && !isUserLoading) {
            return "AUTH";
        }
        if (activityRegistry && !loadingMessage) {
            return "READY";
        }
        return "LOADING";
    }, [activityRegistry, loadingMessage, user]);

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
        <StateManagerContext.Provider value={{ activityRegistry }}>
            <LoadingScreen show={currentState === "LOADING"} message={loadingMessage}></LoadingScreen>
            {content}
        </StateManagerContext.Provider>
    );
}

export const useStateManager = () => useContext(StateManagerContext);
