import TextOption from '@components/ui/TextOption';
import { colors, fontStyles } from '@styles';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatisticsPresentation(props) {
    const {
        effectiveness,
        longestStreak,
        completed,
        failed,
    } = props;

    return (
        <View style={styles.statisticsGrid}>
            <View style={styles.statisticsCell}>
                <Text style={[styles.valueText, { backgroundColor: colors.darkGray }]}>{Math.floor(effectiveness * 100)}%</Text>
                <TextOption>skuteczności</TextOption>
            </View>
            <View style={[styles.statisticsCell, styles.rightCell]}>
                <Text style={[styles.valueText, { backgroundColor: colors.lightSuccess }]}>{completed}</Text>
                <TextOption>wykonanych</TextOption>
            </View>
            <View style={styles.statisticsCell}>
                <Text style={[styles.valueText, { backgroundColor: colors.darkGray }]}>{longestStreak}</Text>
                <TextOption>najdłuższej serii</TextOption>
            </View>
            <View style={[styles.statisticsCell, styles.rightCell]}>
                <Text style={[styles.valueText, { backgroundColor: colors.lightError }]}>{failed}</Text>
                <TextOption>pominiętych</TextOption>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    statisticsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    statisticsCell: {
        flex: 1,
        minWidth: '40%',
        flexDirection: 'row',
        gap: 10,
    },
    rightCell: {
        justifyContent: 'flex-end',
    },
    valueText: {
        ...fontStyles.regularBold,
        color: colors.light,
        width: 48,
        borderRadius: 8,
        textAlign: 'center',
        alignItems: 'center',
    },
});
