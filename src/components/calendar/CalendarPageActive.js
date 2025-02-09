import routes from '@data/router';
import { colors, fontStyles, icons } from '@styles';
import { router } from 'expo-router';
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useReports } from 'src/context/ReportsContext';

export default function CalendarPageActive(props) {
    const {
        day = 99,
        month = 'NAN',
    } = props;

    const { todaysReport } = useReports();
    const moodReport = todaysReport?.mood || {};

    var moodIcon = icons.mood;

    if (moodReport.humor) {
        moodIcon = icons[`mood${moodReport.humor}`];
    }

    return (
        <TouchableOpacity style={styles.container} onPress={() => router.push(routes.newMood)}>
            <View style={styles.textContainer}>
                <Text style={styles.day}>{day}</Text>
                <Text style={styles.month}>{month}</Text>
            </View>
            <Image source={moodIcon} style={{ width: 32, height: 32, filter: !moodReport?.humor ? 'grayscale(100%)' : undefined }} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 48,
        flex: 1.5,
        backgroundColor: colors.primBlue,
        borderRadius: 8,
        padding: 10,
        gap: 5
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    day: {
        ...fontStyles.regularBold,
        color: colors.light,
    },
    month: {
        ...fontStyles.regularNote,
        textTransform: 'uppercase',
        color: colors.light,
    },
});
