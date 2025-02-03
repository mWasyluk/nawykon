import { createContext, useContext, useEffect, useState } from "react";
import { useHabits } from "./HabitsContext";
import { useReports } from "./ReportsContext";
import { formatDate } from "@utils/dateUtil";
import { useFonts } from "expo-font";
import {
    OpenSans_400Regular,
    OpenSans_400Regular_Italic,
    OpenSans_600SemiBold,
    OpenSans_700Bold
} from '@expo-google-fonts/open-sans'
import { Montserrat_500Medium } from '@expo-google-fonts/montserrat';

const StateManagerContext = createContext();

export function StateManagerProvider({ children }) {
    const [fontLoaded, fontError] = useFonts({
        OpenSans_400Regular,
        OpenSans_400Regular_Italic,
        OpenSans_600SemiBold,
        OpenSans_700Bold,
        Montserrat_500Medium,
    });

    const { habits, isLoading: isHabitsLoading, error: habitsError } = useHabits();
    const { habitReports, createHabitReports, isLoading: isReportsLoading, error: reportsError } = useReports();

    const [loading, setLoading] = useState('Weryfikuje stan aplikacji...');
    const [error, setError] = useState('');

    // Creates habit reports for a new day automatically at midnight
    useEffect(() => {
        const handleMidnight = () => {
            const now = new Date();
            const timeUntilMidnight =
                new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();

            setTimeout(async () => {
                await createHabitReports(habits);
                handleMidnight(); // Reset timer for the next day
            }, timeUntilMidnight);
        };

        handleMidnight();
    }, []);

    // Creates habit reports for habits that do not have a report for today yet
    useEffect(() => {
        if (isHabitsLoading || isReportsLoading || habitsError || reportsError)
            return; // Do not run logic if loading or error

        const habitsWithoutReport = habits.filter(habit =>
            !habitReports.some(report =>
                report.habitId === habit.id && formatDate(report.date) === formatDate(new Date())
            )
        );

        if (habitsWithoutReport.length > 0) {
            createHabitReports(habitsWithoutReport);
        }

        setLoading('');
    }, [habits, habitReports]);

    useEffect(() => {
        if (isHabitsLoading || isReportsLoading || !fontLoaded) {
            const message = 'Pobieram dane' +
                (isHabitsLoading ? ' o nawykach'
                    : isReportsLoading ? ' o raportach'
                        : !fontLoaded ? ' o czcionkach'
                            : '') + '...';
            setLoading(message);
        } else if (habitsError || reportsError || fontError) {
            setError("Nie udało mi się pobrać danych. Sprawdź połączenie z Internetem i spróbuj ponownie.");
        } else {
            setLoading('');
            setError('');
        }
    }, [isHabitsLoading, isReportsLoading, habitsError, reportsError, fontLoaded, fontError]);

    return (
        <StateManagerContext.Provider value={{ loading, error }}>
            {children}
        </StateManagerContext.Provider>
    );
}

export const useStateManager = () => useContext(StateManagerContext);
