import SelectableHabitColor from '@components/habit/SelectableHabitColor';
import SelectableHabitType from '@components/habit/SelectableHabitType';
import { SectionContainer, SectionHeader, SubsectionHeader } from '@components/layout';
import { OptionalErrorText } from '@components/text';
import { HabitDetails } from '@models/habit/HabitDetails';
import { metrics } from '@styles';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function EditAvatarSection({ habitBuilder }) {
    const {
        type = habitBuilder.habit?.details.type || HabitDetails.HABIT_TYPES[0],
        color = habitBuilder.habit?.details.color || HabitDetails.HABIT_COLORS[0]
    } = habitBuilder;

    const [typeError, setTypeError] = useState(null);
    const [colorError, setColorError] = useState(null);

    const handleTypeSelection = (selectedType) => {
        if (!selectedType || selectedType === type) return;
        try {
            habitBuilder.withType(selectedType);
            setTypeError(null);
        } catch (error) {
            setTypeError(error.message);
        }
    };

    const handleColorSelection = (selectedColor) => {
        if (!selectedColor || selectedColor === color) return;
        try {
            habitBuilder.withColor(selectedColor);
            setColorError(null);
        } catch (error) {
            setColorError(error.message);
        }
    }

    useEffect(() => {
        try {
            habitBuilder.withType(type);
            habitBuilder.withColor(color);
        } catch (error) { }
    }, []);

    return (
        <SectionContainer>
            <SectionHeader title={'Awatar'} />


            <View>
                <SubsectionHeader title={'Typ'} isRequired={true} />
                <View style={styles.palette}>
                    {HabitDetails.HABIT_TYPES.map((habitType, i) =>
                        <SelectableHabitType
                            key={i}
                            type={habitType}
                            color={color}
                            isSelected={habitType === type}
                            onPress={() => handleTypeSelection(habitType)} />
                    )}
                </View>
            </View>
            <OptionalErrorText>{typeError}</OptionalErrorText>

            <View>
                <SubsectionHeader title={'Kolor'} isRequired={true} />
                <View style={styles.palette}>
                    {HabitDetails.HABIT_COLORS.map((habitColor, i) =>
                        <SelectableHabitColor
                            key={i}
                            color={habitColor}
                            isSelected={habitColor === color}
                            onPress={() => handleColorSelection(habitColor)} />
                    )}
                </View>
            </View>
            <OptionalErrorText>{colorError}</OptionalErrorText>
        </SectionContainer>
    );
}


const styles = StyleSheet.create({
    palette: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: metrics.spacing.xs,
    },
});
