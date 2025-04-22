import Button from '@components/input/Button';
import { INPUT_VARIANTS } from '@components/input/InputContainer';
import TextInput from '@components/input/TextInput';
import { SectionContainer, SectionHeader } from '@components/layout';
import { BodyText, OptionalErrorText } from '@components/text';
import { useUser } from '@contexts/UserContext';
import { ModalService } from '@services/modalService';
import { colors, icons } from '@styles';
import { useState } from 'react';
import { View } from 'react-native';

export default function EditRemindersSection({ habitBuilder }) {
    const {
        reminders = habitBuilder.habit?.reminders || []
    } = habitBuilder;

    const { settings: { notificationsEnabled, notificationsTime } } = useUser();
    const [isWarningShown, setIsWarningShown] = useState(false);
    const [reminderError, setReminderError] = useState(null);

    const addDefaultReminder = () => {
        verifyNotificationsEnabled();
        handleRemindersChange([...reminders, notificationsTime]);
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
        if (!notificationsEnabled && !isWarningShown) {
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
                <View key={`reminder-${i}`} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <BodyText style={{ color: colors.midGray }}>O godzinie</BodyText>
                    <View style={{ width: 120 }}>
                        <TextInput
                            value={reminder}
                            onChange={(value) => changeReminder(i, value)}
                            maxLength={5}
                            error={reminderError}
                            textStyle={{ textAlign: 'center' }}
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
