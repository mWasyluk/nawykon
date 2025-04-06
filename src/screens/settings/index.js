import Button from '@components/input/Button';
import { INPUT_SIZES } from '@components/input/InputContainer';
import ScreenSection from '@components/layout/ScreenSection';
import { PressableText } from '@components/text';
import { useUser } from '@contexts/UserContext';
import { icons } from '@styles';
import { ScrollView } from 'react-native';

export default function SettingsScreen() {
    const { logout } = useUser();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <ScrollView>
            <ScreenSection title="Aplikacja">
                <PressableText disabled={true}>Powiadomienia</PressableText>
                <PressableText disabled={true}>Wyświetlanie</PressableText>
            </ScreenSection>
            <ScreenSection title="Informacje">
                <PressableText disabled={true}>Regulamin użytkownika</PressableText>
                <PressableText disabled={true}>Polityka prywatności</PressableText>
                <PressableText disabled={true}>Pomoc</PressableText>
            </ScreenSection>
            <ScreenSection containerStyle={{ alignItems: 'flex-start' }}>
                <Button
                    title="Wyloguj się"
                    icon={icons.logout}
                    size={INPUT_SIZES.LARGE}
                    onPress={handleLogout}
                />
            </ScreenSection>
        </ScrollView>
    );
}
