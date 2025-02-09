import ScreenSection from '@components/containers/ScreenSection';
import ErrorMessage from '@components/ui/ErrorMessage';
import Switch from '@components/ui/Switch';
import TextInput from '@components/ui/TextInput';
import TextOption from '@components/ui/TextOption';
import { useState } from 'react';
import { View } from 'react-native-web';

export default function HabitReminderSection(props) {
    const {
        habitBuilder = {},
    } = props;

    const [isSet, setIsSet] = useState(habitBuilder.habit?.reminders?.length > 0);
    const [reminders, setReminders] = useState(isSet ? habitBuilder.habit.reminders : ['08:30']);

    const [reminderError, setReminderError] = useState(null);

    const handleSwitchChange = () => {
        const newIsSet = !isSet;
        try {
            habitBuilder.withReminders(newIsSet ? reminders : []);
            setReminderError(null);
        } catch (error) {
            setReminderError(error.message);
        }

        setIsSet(newIsSet);
    }

    const handleReminderChange = (value) => {
        try {
            habitBuilder.withReminders([value]);
            setReminderError(null);
        } catch (error) {
            setReminderError(error.message);
        }

        setReminders([value]);
    }

    return (
        <ScreenSection
            title="Przypomnienie"
        >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Switch defaultState={isSet}
                    onChange={handleSwitchChange} />
                <TextOption disabled={!isSet}>O godzinie</TextOption>
                <TextInput value={reminders[0]}
                    onChange={handleReminderChange}
                    maxLength={5}
                    disabled={!isSet}
                    error={reminderError} />
            </View>
            <ErrorMessage>{reminderError}</ErrorMessage>
        </ScreenSection>
    );
}
