import Button from '@components/input/Button';
import { INPUT_VARIANTS } from '@components/input/InputContainer';
import TextInput from '@components/input/TextInput';
import { SectionContainer, SectionHeader } from '@components/layout';
import { AdaptiveRegularText, OptionalErrorText } from '@components/text';
import { icons } from '@styles';
import { useState } from 'react';
import { View } from 'react-native';

const DEFAULT_REMINDER = '08:00';

export default function EditRemindersSection({ habitBuilder }) {
    const {
        reminders = habitBuilder.habit?.reminders || []
    } = habitBuilder;

    const [reminderError, setReminderError] = useState(null);

    const addDefaultReminder = () => {
        handleRemindersChange([...reminders, DEFAULT_REMINDER]);
    }

    const removeReminder = (index) => {
        const newReminders = [...reminders];
        newReminders.splice(index, 1);
        handleRemindersChange(newReminders);
    }

    const changeReminder = (index, value) => {
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
                <View key={`${i}${reminder}`} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <AdaptiveRegularText>O godzinie</AdaptiveRegularText>
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
