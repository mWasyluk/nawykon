import { Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import {
    OpenSans_400Regular,
    OpenSans_400Regular_Italic,
    OpenSans_600SemiBold,
    OpenSans_700Bold
} from '@expo-google-fonts/open-sans';
import { Statistics } from "@models/reports/Statistics";
import { useFonts } from "expo-font";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Text } from "react-native";
import { useHabits } from "./HabitsContext";
import { useReports } from "./ReportsContext";
import { useUser } from "./UserContext";

const StateManagerContext = createContext({ isReady: false });

export function StateManagerProvider({ children }) {
    const [fontLoaded, fontError] = useFonts({
        OpenSans_400Regular,
        OpenSans_400Regular_Italic,
        OpenSans_600SemiBold,
        OpenSans_700Bold,
        Montserrat_500Medium,
    });

    const { isLoading: isUserLoading, error: userError } = useUser();
    const { isLoading: isHabitsLoading, error: habitsError, habits } = useHabits();
    const { isLoading: isReportsLoading, error: reportsError, dailyReports } = useReports();
    const [statistics, setStatistics] = useState(null);

    const loadingMessage = useMemo(() => {
        if (isUserLoading || isHabitsLoading || isReportsLoading || !fontLoaded) {
            return 'Pobieram dane' +
                (isUserLoading ? ' o użytkowniku'
                    : isHabitsLoading ? ' o nawykach'
                        : isReportsLoading ? ' o raportach'
                            : !fontLoaded ? ' o czcionkach'
                                : '') + '...';
        }
        return '';
    }, [isUserLoading, isHabitsLoading, isReportsLoading, fontLoaded]);

    const errorMessage = useMemo(() => {
        if (userError || habitsError || reportsError || fontError) {
            console.error(userError || habitsError || reportsError || fontError);
            return 'Napotkałem problem' +
                (userError ? ' z pobieraniem danych o użytkowniku'
                    : habitsError ? ' z pobieraniem danych o nawykach'
                        : reportsError ? ' z pobieraniem danych o raportach'
                            : fontError ? ' z pobieraniem czcionek'
                                : '') + '. Sprawdź połączenie z Internetem i spróbuj ponownie.';
        }
        return '';
    }, [userError, habitsError, reportsError, fontError]);

    useEffect(() => {
        if (!dailyReports || !habits) {
            return;
        }
        var stats = statistics;
        if (stats === null) {
            stats = new Statistics(dailyReports, habits);
        } else {
            stats = statistics.clone();
            stats.update(dailyReports, habits);
        }
        setStatistics(stats);
    }, [dailyReports, habits]);

    if (loadingMessage || errorMessage) {
        return (
            <Text> {loadingMessage || errorMessage} </Text>
        );
    } else if (statistics === null) {
        return <Text> {'Przygotowuję statystyki...'} </Text>
    }

    console.log('All data has been loaded successfully. Rendering the app...');

    return (
        <StateManagerContext.Provider value={{ statistics }}>
            {children}
        </StateManagerContext.Provider>
    );
}

export const useStateManager = () => useContext(StateManagerContext);
