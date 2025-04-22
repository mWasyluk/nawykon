import Button from "@components/input/Button";
import { INPUT_VARIANTS } from "@components/input/InputContainer";
import Switch from "@components/input/Switch";
import TextInput from "@components/input/TextInput";
import { SubsectionHeader } from "@components/layout";
import { OptionalErrorText } from "@components/text";
import { useUser } from '@contexts/UserContext';
import { Habit } from '@models/habit/Habit';
import { ModalService } from '@services/modalService';
import { icons, metrics } from "@styles";
import { useMemo, useState } from "react";
import { View } from "react-native";

export default function NotificationsSettingsOptions() {
    const { settings: { notificationsEnabled, notificationsTime }, updateSettings } = useUser();
    const [isNotificationTimeChanged, setIsNotificationTimeChanged] = useState(false);
    const [newNotificationsTime, setNewNotificationTime] = useState(notificationsTime);
    const [notificationError, setNotificationError] = useState(false);

    const notificationTimeButtonVariant = useMemo(() => (
        notificationError || !isNotificationTimeChanged || !notificationsEnabled ? INPUT_VARIANTS.DISABLED : INPUT_VARIANTS.PRIME
    ), [notificationError, isNotificationTimeChanged, notificationsEnabled]);

    const notificationTimeTextVariant = useMemo(() => (
        notificationsEnabled ? INPUT_VARIANTS.DEFAULT : INPUT_VARIANTS.DISABLED
    ), [notificationsEnabled]);

    const handleNotificationEnabledChange = async (value) => {
        try {
            await updateSettings({ notificationsEnabled: value });
        } catch (err) {
            ModalService.showError(err.message);
        }
    }

    const handleNotificationTimeChange = (value) => {
        try {
            Habit.validateReminders([value]);
            setNotificationError(false);
        } catch (err) {
            setNotificationError(err.message);
            return;
        } finally {
            setIsNotificationTimeChanged(true);
            setNewNotificationTime(value);
        }
    }

    const handleNotificationTimeSubmit = async () => {
        if (notificationTimeButtonVariant === INPUT_VARIANTS.DISABLED) {
            return;
        }
        await updateSettings({ notificationsTime: newNotificationsTime });
        setIsNotificationTimeChanged(false);
    }

    return (
        <>
            <View>
                <SubsectionHeader title="Włącz / wyłącz" />
                <Switch
                    isOn={notificationsEnabled}
                    onChange={handleNotificationEnabledChange}
                />
            </View>
            <View>
                <SubsectionHeader title="Domyślna godzina" />
                <View style={{ flexDirection: 'row', gap: metrics.spacing.xs, }}>
                    <TextInput
                        value={newNotificationsTime}
                        variant={notificationTimeTextVariant}
                        onChange={handleNotificationTimeChange}
                        error={notificationError}

                        maxLength={5}
                        style={{ maxWidth: 100 }}
                        textAlign="center"
                    />
                    <Button
                        icon={icons.pen}
                        variant={notificationTimeButtonVariant}
                        onPress={handleNotificationTimeSubmit}
                    />
                </View>
            </View>
            <OptionalErrorText>{notificationError}</OptionalErrorText>
        </>
    );
}
