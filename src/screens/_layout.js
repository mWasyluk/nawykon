import { colors, fontStyles } from '@styles';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native';

export default function Layout() {

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
