import ErrorMessage from '@components/ui/ErrorMessage';
import Switch from '@components/ui/Switch';
import TextInput from '@components/ui/TextInput';
import TextOption from '@components/ui/TextOption';
import { Goal } from '@models/habit/Goal';
import { colors, fontStyles } from '@styles';
import { formatDate, validateTimestamp } from '@utils/dateUtil';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

const nextWeekDate = new Date(new Date().setDate(new Date().getDate() + 7));

export default function EndDateSelection(props) {
    const {
        defaultEndDate,
        onChange = () => { },
        defaultError = null,
    } = props;

    const [isPeriodic, setIsPeriodic] = useState(defaultEndDate ? true : false);
    const [endDateText, setEndDateText] = useState(isPeriodic ? formatDate(defaultEndDate) : formatDate(nextWeekDate));
    const [error, setError] = useState(defaultError);

    const handleIsPeriodicChange = () => {
        const newValue = !isPeriodic;
        setIsPeriodic(newValue);

        if (newValue) {
            try {
                const newEndDate = validateTimestamp(endDateText);
                onChange(newEndDate);
            } catch (error) {
                onChange(undefined);
            }
        } else {
            onChange(undefined);
        }
    };

    const handleEndDateChange = (value) => {
        if (!isPeriodic) {
            return;
        }
        try {
            Goal.validateEndDate(value);
            setEndDateText(value);
            setError(null);
            onChange(value);
        } catch (error) {
            setEndDateText(value);
            setError(error.message);
            return;
        }
    };

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
                    error={error}
                />
            </View>
            <ErrorMessage>{error}</ErrorMessage>
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
