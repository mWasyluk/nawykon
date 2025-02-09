import { colors, fontStyles } from '@styles';
import { StyleSheet, Text, View } from 'react-native';

export default function StatisticsPresentation(props) {
    const {
        completed,
        failed,
    } = props;

    return (
        <View style={styles.statisticsGrid}>
            <View style={[styles.statisticsCell, { justifyContent: 'flex-end' }]}>
                <Text style={{ ...fontStyles.regularNote, color: colors.lightSuccess }}>wykonanych</Text>
                <Text style={[styles.valueText, { borderWidth: 3, borderColor: colors.lightSuccess, color: colors.lightSuccess }]}>{completed}</Text>
            </View>
            <View style={styles.statisticsCell}>
                <Text style={[styles.valueText, { borderWidth: 3, borderColor: colors.lightError, color: colors.lightError }]}>{failed}</Text>
                <Text style={{ ...fontStyles.regularNote, color: colors.lightError }}>pominiętych</Text>
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    statisticsGrid: {
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        gap: 10,
    },
    statisticsCell: {
        flex: 1,
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
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
