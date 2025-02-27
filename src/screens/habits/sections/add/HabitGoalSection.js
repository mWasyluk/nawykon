import SelectableWeekDay from '@components/date/SelectableWeekDays';
import HabitEndDateSelection from '@components/habit/HabitEndDateSelection';
import TextInput from '@components/input/TextInput';
import ScreenSection from '@components/layout/ScreenSection';
import { OptionalErrorText, BodyText } from '@components/text';
import { HabitGoal } from '@models/habit/HabitGoal';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

export default function HabitGoalSection(props) {
    const {
        habitBuilder = {},
    } = props;

    const currentHabitGoal = habitBuilder.habit?.goal;
    const [repetitions, setRepetitions] = useState(currentHabitGoal?.repetitions || HabitGoal.DEFAULT_REPETITIONS);
    const [days, setDays] = useState(currentHabitGoal?.days || HabitGoal.DEFAULT_DAYS);

    const [repetitionsError, setRepetitionsError] = useState(null);
    const [daysError, setDaysError] = useState(null);

    const handleRepetitionsChange = (value) => {
        try {
            const result = parseInt(value);
            habitBuilder.withRepetitions(result);
            setRepetitionsError(null);
        } catch (error) {
            setRepetitionsError(error.message);
        }

        setRepetitions(value);
    };

    const handleDaysChange = (value) => {
        try {
            habitBuilder.withDays(value);
            setDaysError(null);
        } catch (error) {
            setDaysError(error.message);
        }

        setDays(value);
    }

    useEffect(() => {
        if (!currentHabitGoal) {
            try {
                habitBuilder.withRepetitions(repetitions);
                habitBuilder.withDays(days);
            } catch (error) { }
        }
    }, []);

    return (
        <ScreenSection
            title={"Cel"}
            containerStyle={styles.container}>

            <TextInput value={repetitions}
                onChange={handleRepetitionsChange}
                returnKeyType={'next'}
                maxLength={2}
                error={repetitionsError} />
            <BodyText>razy dziennie</BodyText>
            <OptionalErrorText style={{ width: '100%' }}>{repetitionsError}</OptionalErrorText>

            <SelectableWeekDay
                defaultDays={days}
                onChange={handleDaysChange} />
            <OptionalErrorText>{daysError}</OptionalErrorText>

            <HabitEndDateSelection
                habitBuilder={habitBuilder}
            />
        </ScreenSection>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
});
