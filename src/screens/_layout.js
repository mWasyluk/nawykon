import { colors, fontStyles } from '@styles';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import {
    OpenSans_400Regular,
    OpenSans_400Regular_Italic,
    OpenSans_600SemiBold,
    OpenSans_700Bold,
} from '@expo-google-fonts/open-sans'
import { Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import { SafeAreaView, Text } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
    const [loaded, error] = useFonts({
        OpenSans_400Regular,
        OpenSans_400Regular_Italic,
        OpenSans_600SemiBold,
        OpenSans_700Bold,
        Montserrat_500Medium,
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return <Text>Loading...</Text>;
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.light }}>
            <Stack screenOptions={{
                headerStyle: { backgroundColor: colors.light, borderWidth: 0 },
                headerTitleStyle: { ...fontStyles.regularTitle },
            }}>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="dashboard/index" options={{ headerShown: false }} />
                <Stack.Screen name="habits/add" options={{ title: 'Nowy Nawyk', }} />
                <Stack.Screen name="habits/[id]/index" options={{ title: 'Informacje O Nawyku' }} />
                <Stack.Screen name="habits/[id]/edit" options={{ title: 'Edycja Nawyku' }} />
                <Stack.Screen name="mood/add" options={{ title: 'Nowy Raport' }} />
                <Stack.Screen name="stats/index" options={{ title: 'Statystyki' }} />
                <Stack.Screen name="settings/index" options={{ title: 'Ustawienia' }} />
            </Stack>
        </SafeAreaView>
    );
}
