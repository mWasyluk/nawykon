import LoadingScreen from "@screens/commons/LoadingScreen";
import WelcomeScreen from "@screens/commons/WelcomeScreen";
import { useMemo } from "react";
import { useActivity } from "../../contexts/ActivitiesContext";
import { useFonts } from "../../contexts/FontsContext";
import { useHabits } from "../../contexts/HabitsContext";
import { useReports } from "../../contexts/ReportsContext";
import { useSettings } from "../../contexts/SettingsContext";

export default function ScreenManager({ children }) {
    const { isLoading: isFontsLoading } = useFonts();
    const { settings, updateSettings } = useSettings();
    const { activityRegistry } = useActivity();
    const { habits } = useHabits();
    const { dailyReports } = useReports();

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

    const content = useMemo(() => {
        if (settings?.firstRun) {
            return <WelcomeScreen onSkip={() => updateSettings({ firstRun: false })} />;
        } else if (loadingMessage === null) {
            return children;
        }
        return null;
    }, [settings, loadingMessage]);

    return (
        <>
            <LoadingScreen show={loadingMessage !== null} message={loadingMessage}></LoadingScreen>
            {content}
        </>
    );
}

