import { Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import {
    OpenSans_400Regular,
    OpenSans_400Regular_Italic,
    OpenSans_600SemiBold,
    OpenSans_700Bold
} from '@expo-google-fonts/open-sans';
import { Statistics } from "@models/reports/Statistics";
import { colors, fontStyles } from '@styles';
import { useFonts } from "expo-font";
import LottieView from 'lottie-react-native';
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
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

    if (loadingMessage || errorMessage || statistics === null) {
        const message = loadingMessage || errorMessage || 'Przygotowuję statystyki...';
        return (
            <View style={{ backgroundColor: colors.modalBackground, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: colors.modalBackground, justifyContent: 'center', alignItems: 'center', width: 500, height: 300 }}>
                    <LottieView
                        autoPlay={true}
                        loop={true}
                        style={{ width: '80%', height: '100%' }}
                        source={require('@assets/logo-loading.json')}
                    />
                </View>
                <Text style={{ ...fontStyles.regular, marginTop: -100 }}>{message}</Text>
            </View>
        );
    }

    return (
        <StateManagerContext.Provider value={{ statistics }}>
            {children}
        </StateManagerContext.Provider>
    );
}

export const useStateManager = () => useContext(StateManagerContext);
