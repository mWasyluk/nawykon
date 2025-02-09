import ErrorMessage from '@components/ui/ErrorMessage';
import Switch from '@components/ui/Switch';
import TextInput from '@components/ui/TextInput';
import TextOption from '@components/ui/TextOption';
import { colors, fontStyles } from '@styles';
import { formatDate } from '@utils/dateUtil';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

const nextWeekDate = new Date(new Date().setDate(new Date().getDate() + 7));

export default function EndDateSelection(props) {
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
                <TextOption>okresowo</TextOption>
            </View>

            <View style={styles.row}>
                <TextOption disabled={!isPeriodic}>Do</TextOption>
                <TextInput
                    value={endDateText}
                    onChange={handleEndDateChange}
                    maxLength={10}
                    disabled={!isPeriodic}
                    short={true}
                    error={endDateError}
                />
            </View>
            <ErrorMessage>{endDateError}</ErrorMessage>
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
    error: {
        ...fontStyles.regularNote,
        marginTop: -10,
        color: colors.darkError,
    },
});
