import ScreenSection from '@components/containers/ScreenSection';
import Button from '@components/ui/Button';
import TextOption from '@components/ui/TextOption';
import { icons } from '@styles';
import { ScrollView } from 'react-native';
import { useUser } from 'src/context/UserContext';

export default function SettingsScreen() {
    const { logout } = useUser();

    return (
        <ScrollView>
            <ScreenSection title="Aplikacja">
                <TextOption disabled={true}>Powiadomienia</TextOption>
                <TextOption disabled={true}>Wyświetlanie</TextOption>
            </ScreenSection>
            <ScreenSection title="Informacje">
                <TextOption disabled={true}>Regulamin użytkownika</TextOption>
                <TextOption disabled={true}>Polityka prywatności</TextOption>
                <TextOption disabled={true}>Pomoc</TextOption>
            </ScreenSection>
            <ScreenSection containerStyle={{ alignItems: 'flex-start' }}>
                <Button icon={icons.logout} title="Wyloguj się" onPress={logout} />
            </ScreenSection>
        </ScrollView>
    );
}
