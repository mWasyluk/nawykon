import { ScreenContainer, SectionContainer, SectionHeader } from '@components/layout';
import { PressableText } from '@components/text';
import { DailyReportService } from '@services/dailyReportService';
import { HabitService } from '@services/habitsService';
import { ModalService } from '@services/modalService';
import { UserService } from '@services/userService';
import { colors, metrics } from '@styles';
import NotificationsSettingsOptions from './sections/NotificationsSettingsOptions';
import AccountSettingsOptions from './sections/AccountSettingsOptions';

export default function SettingsScreen() {
    const handleTermsOfServicePress = () => {
        ModalService.showTermsOfService();
    }

    const handlePrivacyPolicyPress = () => {
        ModalService.showPrivacyPolicy();
    }

    const handleDeleteAccountPress = async () => {
        const deleteAllData = async () => {
            const deleted = {
                ["raporty dzienne"]: false,
                ["nawyki"]: false,
                ["konto"]: false,
            };
            try {
                await DailyReportService.deleteAllDailyReports();
                deleted["raporty dzienne"] = true;
                await HabitService.deleteAllHabits();
                deleted["nawyki"] = true;
                await UserService.deleteAccount();
                deleted["konto"] = true;
            } catch (err) {
                if (err.code === "auth/requires-recent-login") {
                    ModalService.showConfirm(
                        "Pełne usunięcie konta wymaga ponownego zalogowania się. Czy chcesz to zrobić teraz?",
                        UserService.logout()
                    )
                }
            }

            const notDeleted = Object.keys(deleted).filter(key => !deleted[key])
            if (notDeleted.length > 0) {
                ModalService.showError(`Następujące dane nie mogły zostać usunięte: ${notDeleted.join(", ")}. Spróbuj ponownie później.`);
            }
        }

        ModalService.showConfirm(
            'Czy na pewno chcesz usunąć konto oraz wszystkie powiązane z nim dane? Ta akcja jest nieodwracalna.',
            deleteAllData
        );
    }

    return (
        <ScreenContainer>
            <SectionContainer>
                <SectionHeader title={"Konto"} />
                <AccountSettingsOptions />
            </SectionContainer>

            <SectionContainer>
                <SectionHeader title={"Powiadomienia"} />
                <NotificationsSettingsOptions />
            </SectionContainer>

            <SectionContainer style={{ marginTop: metrics.spacing.xl }}>
                <PressableText onPress={handleTermsOfServicePress}>Regulamin użytkowania</PressableText>
                <PressableText onPress={handlePrivacyPolicyPress}>Polityka prywatności</PressableText>
                <PressableText onPress={handleDeleteAccountPress} color={colors.darkError}>Usuń konto</PressableText>
            </SectionContainer>
        </ScreenContainer>
    );
}
