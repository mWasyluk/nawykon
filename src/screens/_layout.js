import DashboardNavHeader from '@components/navigation/DashboardNavHeader';
import { NavHeader } from '@components/navigation/NavHeader';
import { colors, fontStyles } from '@styles';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native';

export default function Layout() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.light }}>
            <Stack screenOptions={{
                header: ({ options }) => options.customHeader || <NavHeader title={options.title} back home />,
                headerStyle: { backgroundColor: colors.light, borderWidth: 0 },
                headerTitleStyle: { ...fontStyles.header },
            }} >
                <Stack.Screen name="index" options={{ customHeader: <DashboardNavHeader /> }} />
                <Stack.Screen name="habits/add" options={{ title: 'Nowy Nawyk' }} />
                <Stack.Screen name="habits/[id]/index" options={{ title: 'Informacje O Nawyku' }} />
                <Stack.Screen name="habits/[id]/edit" options={{ title: 'Edycja Nawyku' }} />
                <Stack.Screen name="mood/[date]/index" options={{ title: 'Raport Nastroju' }} />
                <Stack.Screen name="stats/index" options={{ title: 'Statystyki' }} />
                <Stack.Screen name="settings/index" options={{ title: 'Ustawienia' }} />
            </Stack>
        </SafeAreaView>
    );
}
