import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fontStyles } from '@styles';
import { shortDays } from '@data/time';

export default function SelectableWeekDay(props) {
    const {
        defaultDays = [],
        onChange = () => { },
    } = props;

    const [selectedDays, setSelectedDays] = useState(defaultDays);

    const toggleDay = (day) => {
        let updatedDays;
        if (selectedDays.includes(day)) {
            // Usunięcie dnia, jeśli jest już zaznaczony
            updatedDays = selectedDays.filter((d) => d !== day);
        } else {
            // Dodanie dnia, jeśli nie jest zaznaczony
            updatedDays = [...selectedDays, day];
        }
        setSelectedDays(updatedDays);
        onChange(updatedDays);
    };

    return (
        <View style={styles.container}>
            {shortDays.map((day, index) => {
                const isSelected = selectedDays.includes(index);
                return (
                    <TouchableOpacity key={index}
                        style={[styles.dayButton, {
                            backgroundColor: isSelected ? colors.primBlue : colors.light,
                            borderColor: isSelected ? colors.primBlue : colors.lightGray
                        }]}
                        onPress={() => toggleDay(index)}>
                        <Text style={[styles.dayText, {
                            color: isSelected ? colors.light : colors.midGray
                        }]}>{day}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const DEFAULT_HEIGHT = 32;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    dayButton: {
        height: DEFAULT_HEIGHT,
        borderWidth: 2,
        borderRadius: DEFAULT_HEIGHT / 2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        outlineStyle: 'none',
        flex: 1,
    },
    dayText: {
        ...fontStyles.regular,
    },
});
