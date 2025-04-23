import { ActivityRegistry } from "@models/reports/ActivityRegistry";
import AuthScreen from "@screens/commons/auth/AuthScreen";
import LoadingScreen, { LOADING_ANIMATION_DURATION } from "@screens/commons/auth/LoadingScreen";
import { ModalService } from "@services/modalService";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useFonts } from "./FontsContext";
import { useHabits } from "./HabitsContext";
import { useReports } from "./ReportsContext";
import { useUser } from "./UserContext";

const StateManagerContext = createContext({ activityRegistry: null });

export function StateManagerProvider({ children }) {
    const { isLoading: isFontsLoading } = useFonts();
    const { user } = useUser();
    const { habits } = useHabits();
    const { dailyReports } = useReports();

    const [activityRegistry, setActivityRegistry] = useState(null);
    const [content, setContent] = useState(null);

    const loadingMessage = useMemo(() => {
        if (isFontsLoading) {
            return '';
        }
        if (!user || !habits || !dailyReports) {
            return 'Pobieram dane' +
                (!user ? ' o użytkowniku'
                    : !habits ? ' o nawykach'
                        : !dailyReports ? ' o raportach'
                            : '') + '...';
        }
        if (!activityRegistry) {
            return 'Tworzę rejestr aktywności...';
        }
        return null;
    }, [isFontsLoading, user, habits, dailyReports, activityRegistry]);

    useEffect(() => {
        if (!dailyReports || !habits) {
            return;
        }

        try {
            if (!activityRegistry) {
                setActivityRegistry(new ActivityRegistry(dailyReports, habits));
            } else {
                const isUpdated = activityRegistry.update(dailyReports, habits);
                if (isUpdated) {
                    setActivityRegistry(activityRegistry.clone());
                }
            }
        } catch (err) {
            console.error(err);
            ModalService.showError('Nie mogłem wygenerować rejestru aktywności. Odśwież aplikację, żebym mógł spróbować jeszcze raz.');
        }
    }, [dailyReports, habits]);

    const currentState = useMemo(() => {
        if (!user) {
            return "AUTH";
        }
        if (loadingMessage === null) {
            return "READY";
        }
        return "LOADING";
    }, [loadingMessage, user]);

    useEffect(() => {
        let timer;
        if (currentState === "AUTH") {
            setContent(<AuthScreen />);
        } else if (currentState === "READY") {
            timer = setTimeout(() => {
                setContent(children);
            }, LOADING_ANIMATION_DURATION);
        } else {
            setContent(null);
        }


        return () => timer && clearTimeout(timer);
    }, [currentState]);

    return (
        <StateManagerContext.Provider value={{ activityRegistry }}>
            <LoadingScreen show={currentState === "LOADING"} message={loadingMessage}></LoadingScreen>
            {content}
        </StateManagerContext.Provider>
    );
}

export const useStateManager = () => useContext(StateManagerContext);
