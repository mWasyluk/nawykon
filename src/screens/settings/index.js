import ScreenSection from '@components/layout/ScreenSection';
import Button from '@components/input/Button';
import { AdaptiveRegularText } from '@components/text';
import { icons } from '@styles';
import { ScrollView } from 'react-native';
import { useUser } from '@contexts/UserContext';

export default function SettingsScreen() {
    const { logout } = useUser();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <ScrollView>
            <ScreenSection title="Aplikacja">
                <AdaptiveRegularText disabled={true}>Powiadomienia</AdaptiveRegularText>
                <AdaptiveRegularText disabled={true}>Wyświetlanie</AdaptiveRegularText>
            </ScreenSection>
            <ScreenSection title="Informacje">
                <AdaptiveRegularText disabled={true}>Regulamin użytkownika</AdaptiveRegularText>
                <AdaptiveRegularText disabled={true}>Polityka prywatności</AdaptiveRegularText>
                <AdaptiveRegularText disabled={true}>Pomoc</AdaptiveRegularText>
            </ScreenSection>
            <ScreenSection containerStyle={{ alignItems: 'flex-start' }}>
                <Button icon={icons.logout} title="Wyloguj się" onPress={handleLogout} />
            </ScreenSection>
        </ScrollView>
    );
}
