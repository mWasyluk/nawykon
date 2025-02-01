import ScreenSection from '@components/containers/ScreenSection';
import EndDateSelection from '@components/habit/PeriodSelection';
import SelectableWeekDay from '@components/SelectableWeekDays';
import ErrorMessage from '@components/ui/ErrorMessage';
import TextInput from '@components/ui/TextInput';
import TextOption from '@components/ui/TextOption';
import { defaultHabitGoalProps, Goal } from '@models/habit/Goal';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

export default function HabitGoalSection(props) {
    const {
        defaultGoal = defaultHabitGoalProps,
        onChange = () => { },
    } = props;

    const [timesPerDay, setTimesPerDay] = useState(defaultGoal.timesPerDay);
    const [daysOfWeek, setDaysOfWeek] = useState(defaultGoal.daysOfWeek);
    const [endDate, setEndDate] = useState(defaultGoal.endDate);

    const [timesPerDayError, setTimesPerDayError] = useState(null);
    const [daysOfWeekError, setDaysOfWeekError] = useState(null);

    const handleTimesPerDayChange = (value) => {
        const result = parseInt(value);

        try {
            Goal.validateTimesPerDay(result);
            setTimesPerDay(result);
            setTimesPerDayError(null);
        } catch (error) {
            setTimesPerDay('');
            setTimesPerDayError(error.message);
        }

        onChange({ timesPerDay: result });
    };

    const handleDaysOfWeekChange = (value) => {
        try {
            Goal.validateDaysOfWeek(value);
            setDaysOfWeekError(null);
            setDaysOfWeek(value);
        } catch (error) {
            setDaysOfWeekError(error.message);
            setDaysOfWeek(value);
        }

        onChange({ daysOfWeek: value });
    }

    const handleEndDateChange = (value) => {
        setEndDate(value);
        onChange({ endDate: value });
    }

    useEffect(() => {
        onChange({ timesPerDay, daysOfWeek, endDate });
    }, [timesPerDay, daysOfWeek, endDate]);

    return (
        <ScreenSection
            title={"Cel"}
            containerStyle={styles.container}>

            <TextInput value={timesPerDay}
                onChange={handleTimesPerDayChange}
                returnKeyType={'next'}
                maxLength={2}
                error={timesPerDayError} />
            <TextOption>razy dziennie</TextOption>
            <ErrorMessage style={{ width: '100%' }}>{timesPerDayError}</ErrorMessage>

            <SelectableWeekDay
                defaultDays={daysOfWeek}
                onChange={handleDaysOfWeekChange} />
            <ErrorMessage>{daysOfWeekError}</ErrorMessage>

            <EndDateSelection
                defaultEndDate={endDate}
                onChange={handleEndDateChange}
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
