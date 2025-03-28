import NumberInput from '@components/input/NumberInput';
import SelectableTextOption from '@components/input/SelectableTextOption';
import { SectionContainer, SectionHeader, SubsectionHeader } from '@components/layout';
import { OptionalErrorText } from '@components/text';
import { shortDays } from '@constants/time';
import EditEndDateSubsection from '@screens/habits/sections/EditEndDateSubsection';
import { metrics } from '@styles';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function EditGoalSection({ habitBuilder }) {
    const {
        repetitions = habitBuilder.habit?.goal.repetitions || 1,
        days = habitBuilder.habit?.goal.days || [0, 1, 2, 3, 4],
        endDate = habitBuilder.habit?.endDate || undefined,
    } = habitBuilder;

    const [repetitionsError, setRepetitionsError] = useState(null);
    const [daysError, setDaysError] = useState(null);
    const [endDateError, setEndDateError] = useState(null);

    const handleRepetitionsChange = (value) => {
        try {
            habitBuilder.withRepetitions(value);
            setRepetitionsError(null);
        } catch (error) {
            setRepetitionsError(error.message);
        }
    };

    const handleDaysChange = (value) => {
        try {
            habitBuilder.withDays(value);
            setDaysError(null);
        } catch (error) {
            setDaysError(error.message);
        }
    }

    const handleDaySelection = (dayIndex, isSelected) => {
        const newDays = [...days];
        if (isSelected) {
            newDays.push(dayIndex);
        } else {
            const index = newDays.indexOf(dayIndex);
            if (index > -1) {
                newDays.splice(index, 1);
            }
        }
        handleDaysChange(newDays);
    }

    const handleEndDateChange = (value) => {
        try {
            habitBuilder.withEndDate(value);
            setEndDateError(null);
        } catch (error) {
            setEndDateError(error.message);
        }
    }

    useEffect(() => {
        try {
            habitBuilder.withRepetitions(repetitions);
            habitBuilder.withDays(days);
            habitBuilder.withEndDate(endDate);
        } catch (error) { }
    }, []);

    return (
        <SectionContainer>
            <SectionHeader title={'Cel'} />

            <View>
                <SubsectionHeader title={'Ilość powtórzeń'} isRequired={true} />
                <NumberInput
                    value={repetitions}
                    minValue={1}
                    maxValue={99}
                    onChange={handleRepetitionsChange}
                />
            </View>
            <OptionalErrorText>{repetitionsError}</OptionalErrorText>

            <View>
                <SubsectionHeader title={'Dni aktywności'} isRequired={true} />
                <View style={styles.rowContainer}>
                    {shortDays.map((dayName, dayIndex) => (
                        <SelectableTextOption key={dayIndex}
                            text={dayName}
                            isSelected={days.includes(dayIndex)}
                            onSelect={(isSelected) => { handleDaySelection(dayIndex, isSelected) }}
                            style={styles.dayOption}
                        />
                    ))}
                </View>
            </View>
            <OptionalErrorText>{daysError}</OptionalErrorText>

            <View>
                <SubsectionHeader title={'Data zakończenia'} />
                <EditEndDateSubsection
                    endDate={endDate}
                    error={endDateError}
                    onChange={handleEndDateChange}
                    style={styles.rowContainer}
                />
            </View>
            <OptionalErrorText>{endDateError}</OptionalErrorText>

        </SectionContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: metrics.spacing.sm,
    },
    dayOption: {
        flex: 1,
    }
});
