import DashboardNavHeader from '@components/navigation/DashboardNavHeader';
import { NavHeader } from '@components/navigation/NavHeader';
import { colors } from '@styles';
import { Stack } from 'expo-router';

export default function Layout() {
    return (
        <Stack screenOptions={{
            header: ({ options }) => options.customHeader || <NavHeader title={options.title} back home />,
            contentStyle: { backgroundColor: colors.light },
            navigationBarHidden: true,
        }} >
            <Stack.Screen name="index" options={{ customHeader: <DashboardNavHeader /> }} />
            <Stack.Screen name="habits/add" options={{ title: 'Nowy Nawyk' }} />
            <Stack.Screen name="habits/[id]/index" options={{ title: 'Informacje O Nawyku' }} />
            <Stack.Screen name="habits/[id]/edit" options={{ title: 'Edycja Nawyku' }} />
            <Stack.Screen name="mood/[date]/index" options={{ title: 'Raport Nastroju' }} />
            <Stack.Screen name="stats/index" options={{ title: 'Statystyki' }} />
            <Stack.Screen name="settings/index" options={{ title: 'Ustawienia' }} />
        </Stack>
    );
}
