import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontStyles } from '@styles';

export default function CalendarPage(props) {
    const { day = 99, month = 'NAN' } = props;

    return (
        <View style={styles.container}>
            <Text style={styles.day}>{day}</Text>
            <Text style={styles.month}>{month}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 48,
        flex: 1,
        borderWidth: 1,
        borderColor: colors.lightGray,
        borderRadius: 8,
    },
    day: {
        ...fontStyles.regularBold,
        color: colors.darkGray,
    },
    month: {
        ...fontStyles.regularNote,
        textTransform: 'uppercase',
        color: colors.midGray,
    },
});
