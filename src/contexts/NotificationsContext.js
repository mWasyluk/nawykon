import { ModalService } from '@services/modalService';
import * as Notifications from 'expo-notifications';
import { useEffect, useMemo, useState } from 'react';
import { Linking } from 'react-native';
import { useHabits } from './HabitsContext';
import { useSettings } from './SettingsContext';

// Configure default notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export function NotificationsProvider({ children }) {
    const { habits } = useHabits();
    const { settings } = useSettings(null);
    const [isAnySet, setIsAnySet] = useState(false);

    const isNotificationsEnabled = useMemo(() => settings?.notificationsEnabled, [settings?.notificationsEnabled]);

    useEffect(() => {
        if (!habits) return;

        const syncNotifications = async (enabled) => {
            if (isAnySet) {
                cancelAllNotifications();
            }
            if (enabled) {
                const hasPermissions = await requestPermissions();
                if (!hasPermissions) {
                    return;
                }

                for (const habit of habits) {
                    await scheduleHabitNotifications(habit);
                }
            }
        }

        syncNotifications(isNotificationsEnabled);
    }, [habits, isNotificationsEnabled]);

    // Check and request permissions
    const requestPermissions = async () => {
        const currentSettings = await Notifications.getPermissionsAsync();
        let isGranted = currentSettings.granted || currentSettings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;

        // If permissions are not granted, request them
        if (!isGranted) {
            const requestedSettings = await Notifications.requestPermissionsAsync();
            isGranted = requestedSettings.granted || requestedSettings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
        }

        // If permissions are still not granted, show a modal with instructions
        if (!isGranted) {
            ModalService.showConfirm(
                "Powiadomienia są zablokowane. Włącz je w systemowych ustawieniach aplikacji i spróbuj ponownie.",
                () => Linking.openSettings(),
            );
        }

        return isGranted;
    };

    const scheduleHabitNotifications = async (habit) => {
        try {
            // If reminders is an empty array, removing all notifications is sufficient
            if (habit.reminders.length === 0) {
                return;
            }

            // Iterate through days when the habit should be performed
            for (const day of habit.goal.days) {
                // Iterate through notification times
                for (const timeString of habit.reminders) {
                    const [hours, minutes] = timeString.split(':').map(Number);
                    const identifier = `habit-${habit.id}-${day}-${timeString.replace(':', '')}`;

                    // Set up the trigger
                    const trigger = {
                        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
                        hour: hours,
                        minute: minutes,
                        weekday: day === 6 ? 1 : day + 2,
                    };

                    // Schedule the notification
                    await Notifications.scheduleNotificationAsync({
                        content: {
                            title: habit.details.name,
                            body: `Czas na powtórzenie nawyku ${habit.details.name}!`,
                            data: { habitId: habit.id },
                        },
                        trigger,
                        identifier,
                    });
                    setIsAnySet(true);
                }
            }
        } catch (error) {
            ModalService.showError(`Nie udało się ustawić powiadomień dla nawyku ${habit.details.name}. Spróbuj ponownie później.`);
        }
    };

    const cancelAllNotifications = async () => {
        try {
            await Notifications.cancelAllScheduledNotificationsAsync();
            setIsAnySet(false);
        } catch (error) {
            ModalService.showError("Nie udało się wyłączyć powiadomień. Spróbuj ponownie później.");
        }
    };

    return children;
}
