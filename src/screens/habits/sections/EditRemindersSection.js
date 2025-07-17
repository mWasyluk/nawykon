import Button from '@components/input/Button';
import TimePicker from '@components/input/datetime/TimePicker';
import { INPUT_VARIANTS } from '@components/input/InputContainer';
import { SectionContainer, SectionHeader } from '@components/layout';
import { BodyText, OptionalErrorText } from '@components/text';
import { useSettings } from '@contexts/SettingsContext';
import { ModalService } from '@services/modalService';
import { colors, icons } from '@styles';
import { useState } from 'react';
import { View } from 'react-native';

export default function EditRemindersSection({ habitBuilder }) {
    const {
        reminders = habitBuilder.habit?.reminders || []
    } = habitBuilder;

    const { settings } = useSettings();
    const [isWarningShown, setIsWarningShown] = useState(false);
    const [reminderError, setReminderError] = useState(null);

    const addDefaultReminder = () => {
        verifyNotificationsEnabled();
        handleRemindersChange([...reminders, settings.notificationsTime]);
    }

    const removeReminder = (index) => {
        const newReminders = [...reminders];
        newReminders.splice(index, 1);
        handleRemindersChange(newReminders);
    }

    const changeReminder = (index, value) => {
        verifyNotificationsEnabled();
        const newReminders = [...reminders];
        newReminders[index] = value;
        handleRemindersChange(newReminders);
    }

    const handleRemindersChange = (newReminders) => {
        try {
            habitBuilder.withReminders(newReminders);
            setReminderError(null);
        } catch (error) {
            setReminderError(error.message);
        }
    }

    const verifyNotificationsEnabled = () => {
        if (!settings.notificationsEnabled && !isWarningShown) {
            ModalService.showInfo(
                "Powiadomienia są wyłączone",
                <BodyText>
                    {"Nie otrzymasz przypomnienia, dopóki powiadomienia są wyłączone. Przejdź do ustawień, aby je włączyć."}
                </BodyText>
            );
            setIsWarningShown(true);
        }
    }

    return (
        <SectionContainer>
            <SectionHeader
                title="Przypomnienie"
                right={<Button
                    title="Dodaj"
                    icon={icons.plus}
                    onPress={addDefaultReminder}
                />}
            />
            {reminders.map((reminder, i) => (
                <View key={`reminder-${reminder}-${i}`} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <BodyText style={{ color: colors.midGray }}>O godzinie</BodyText>
                    <View style={{ width: 120 }}>
                        <TimePicker
                            hours={reminder.split(":")[0]}
                            minutes={reminder.split(":")[1]}
                            onChange={(time) => changeReminder(i, time)}
                        />
                    </View>
                    <Button
                        icon={icons.bin}
                        onPress={() => { removeReminder(i) }}
                        variant={INPUT_VARIANTS.ERROR}
                        style={{ position: 'absolute', right: 0 }}
                    />
                </View>
            ))}
            <OptionalErrorText>{reminderError}</OptionalErrorText>
        </SectionContainer>
    );
}
