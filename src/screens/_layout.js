import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, fontStyles } from '@styles';
import { Stack } from 'expo-router';
import { SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';

export default function Layout() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.light }}>
            <Stack screenOptions={{
                headerStyle: { backgroundColor: colors.light, borderWidth: 0 },
                headerTitleStyle: { ...fontStyles.regularTitle },
            }} >
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="dashboard/index" options={{ headerShown: false }} />
                <Stack.Screen name="habits/add" options={{ title: 'Nowy Nawyk', }} />
                <Stack.Screen name="habits/[id]/index" options={{ title: 'Informacje O Nawyku' }} />
                <Stack.Screen name="habits/[id]/edit" options={{ title: 'Edycja Nawyku' }} />
                <Stack.Screen name="mood/add" options={{ title: 'Nowy Raport' }} />
                <Stack.Screen name="stats/index" options={{ title: 'Statystyki' }} />
                <Stack.Screen name="settings/index" options={{ title: 'Ustawienia' }} />
            </Stack>

            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => navigation.navigate('index')}
            >
                <Ionicons name="home" size={24} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    floatingButton: {
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: [{ translateX: -25 }],
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.darkBlue,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
});
