import { ActivityRegistry } from "@models/reports/ActivityRegistry";
import LoadingScreen, { LOADING_ANIMATION_DURATION } from "@screens/commons/LoadingScreen";
import WelcomeScreen from "@screens/commons/WelcomeScreen";
import { ModalService } from "@services/modalService";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useFonts } from "./FontsContext";
import { useHabits } from "./HabitsContext";
import { useReports } from "./ReportsContext";
import { useSettings } from "./SettingsContext";

const StateManagerContext = createContext({ activityRegistry: null });

export function StateManagerProvider({ children }) {
    const { isLoading: isFontsLoading } = useFonts();
    const { settings, updateSettings } = useSettings();
    const { habits } = useHabits();
    const { dailyReports } = useReports();

    const [activityRegistry, setActivityRegistry] = useState(null);
    const [content, setContent] = useState(null);

    const loadingMessage = useMemo(() => {
        if (isFontsLoading) {
            return '';
        }
        if (!settings || !habits || !dailyReports) {
            return 'Pobieram dane' +
                (!settings ? ' o ustawieniach'
                    : !habits ? ' o nawykach'
                        : !dailyReports ? ' o raportach'
                            : '') + '...';
        }
        if (!activityRegistry) {
            return 'Tworzę rejestr aktywności...';
        }
        return null;
    }, [isFontsLoading, settings, habits, dailyReports, activityRegistry]);

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
        if (settings?.firstRun) {
            return "FIRST_RUN";
        } else if (loadingMessage === null) {
            return "READY";
        }
        return "LOADING";
    }, [settings, loadingMessage]);

    useEffect(() => {
        let timer;
        if (currentState === "FIRST_RUN") {
            setContent(<WelcomeScreen onSkip={() => updateSettings({ firstRun: false })} />);
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
