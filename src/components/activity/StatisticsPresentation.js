import { CaptionText, BodyBoldText } from '@components/text';
import { colors } from '@styles';
import { StyleSheet, View } from 'react-native';

export default function StatisticsPresentation(props) {
    const {
        completed,
        failed,
    } = props;

    return (
        <View style={styles.statisticsGrid}>
            <View style={[styles.statisticsCell, { justifyContent: 'flex-end' }]}>
                <CaptionText style={{ color: colors.lightSuccess }}>wykonanych</CaptionText>
                <BodyBoldText style={[styles.valueText, { borderColor: colors.lightSuccess, color: colors.lightSuccess }]}>{completed}</BodyBoldText>
            </View>
            <View style={styles.statisticsCell}>
                <BodyBoldText style={[styles.valueText, { borderColor: colors.lightError, color: colors.lightError }]}>{failed}</BodyBoldText>
                <CaptionText style={{ color: colors.lightError }}>pominiętych</CaptionText>
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
        color: colors.light,
        width: 48,
        borderWidth: 3,
        borderRadius: 8,
        textAlign: 'center',
        alignItems: 'center',
    },
});
