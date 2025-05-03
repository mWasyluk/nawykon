import { ScreenContainer, SectionContainer, SectionHeader } from '@components/layout';
import { PressableText } from '@components/text';
import { useReset } from '@contexts/ProvidersWrapper';
import { ModalService } from '@services/modalService';
import StorageService from '@services/storeService';
import { colors, metrics } from '@styles';
import NotificationsSettingsOptions from './sections/NotificationsSettingsOptions';

export default function SettingsScreen() {
    const { resetApp } = useReset();

    const handleTermsOfServicePress = () => {
        ModalService.showTermsOfService();
    }

    const handlePrivacyPolicyPress = () => {
        ModalService.showPrivacyPolicy();
    }

    const handleDeleteDataPress = async () => {
        const deleteAllData = async () => {
            await StorageService.clear();
            resetApp();
        }

        ModalService.showConfirm(
            'Czy na pewno chcesz usunąć wszystkie swoje dane? Ta akcja jest nieodwracalna.',
            deleteAllData
        );
    }

    return (
        <ScreenContainer>
            <SectionContainer>
                <SectionHeader title={"Powiadomienia"} />
                <NotificationsSettingsOptions />
            </SectionContainer>

            <SectionContainer style={{ marginTop: metrics.spacing.xl }}>
                <PressableText onPress={handleTermsOfServicePress}>Regulamin użytkowania</PressableText>
                <PressableText onPress={handlePrivacyPolicyPress}>Polityka prywatności</PressableText>
                <PressableText onPress={handleDeleteDataPress} color={colors.darkError}>Usuń dane</PressableText>
            </SectionContainer>
        </ScreenContainer>
    );
}
