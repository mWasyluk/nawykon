import Switch from '@components/input/Switch';
import TextInput from '@components/input/TextInput';
import { AdaptiveRegularText, OptionalErrorText, BodyText } from '@components/text';
import { formatDate } from '@utils/dateUtil';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

const nextWeekDate = new Date(new Date().setDate(new Date().getDate() + 7));

export default function HabitEndDateSelection(props) {
    const {
        habitBuilder,
    } = props;

    const currentHabitEndDate = habitBuilder.habit?.endDate;
    const [isPeriodic, setIsPeriodic] = useState(currentHabitEndDate ? true : false);
    const [endDateText, setEndDateText] = useState(isPeriodic ? currentHabitEndDate : formatDate(nextWeekDate));

    const [endDateError, setEndDateError] = useState(null);

    const handleIsPeriodicChange = () => {
        const newValue = !isPeriodic;
        setIsPeriodic(newValue);

        try {
            newValue ? habitBuilder.withEndDate(endDateText) : habitBuilder.withEndDate(undefined);
            setEndDateError(null);
        } catch (error) {
            setEndDateError(error.message);
        }
    };

    const handleEndDateChange = (value) => {
        try {
            habitBuilder.withEndDate(isPeriodic ? value : undefined);
            setEndDateError(null);
        } catch (error) {
            setEndDateError(error.message);
        }

        setEndDateText(value);
    }

    useEffect(() => {
        if (!currentHabitEndDate && isPeriodic) {
            habitBuilder.withEndDate(endDateText);
        }
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Switch onChange={handleIsPeriodicChange} defaultState={isPeriodic} />
                <BodyText>okresowo</BodyText>
            </View>

            <View style={styles.row}>
                <AdaptiveRegularText disabled={!isPeriodic}>Do</AdaptiveRegularText>
                <TextInput
                    value={endDateText}
                    onChange={handleEndDateChange}
                    maxLength={10}
                    disabled={!isPeriodic}
                    short={true}
                    error={endDateError}
                />
            </View>
            <OptionalErrorText>{endDateError}</OptionalErrorText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'flex-start',
        gap: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 10,
    },
});
