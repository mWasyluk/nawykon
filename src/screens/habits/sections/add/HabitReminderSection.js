import React, { useState } from 'react';
import TextInput from '@components/ui/TextInput';
import Switch from '@components/ui/Switch';
import ScreenSection from '@components/containers/ScreenSection';
import TextOption from '@components/ui/TextOption';

export default function HabitReminderSection(props) {
    const {
        defaultReminders = ['08:30'],
        onChange = () => { },
    } = props;

    const [isSet, setIsSet] = useState(defaultReminders.length > 0);
    const [reminders, setReminders] = useState(isSet ? defaultReminders : ['08:30']);

    const handleSwitchChange = () => {
        setIsSet(!isSet);
        onChange(isSet ? [] : reminders);
    }

    const handleReminderChange = (value) => {
        setReminders([value]);
        onChange(isSet ? [value] : []);
    }

    return (
        <ScreenSection
            title="Przypomnienie"
            containerStyle={{ flexDirection: 'row', alignItems: 'center' }}
        >
            <Switch defaultState={isSet}
                onChange={handleSwitchChange} />
            <TextOption disabled={!isSet}>O godzinie</TextOption>
            <TextInput value={reminders[0]}
                onChange={handleReminderChange}
                maxLength={5}
                disabled={!isSet} />
        </ScreenSection>
    );
}
