import Button from '@components/input/Button';
import { SectionContainer, SectionHeader } from '@components/layout';
import { BodyBoldText } from '@components/text';
import routes from '@constants/router';
import { colors, metrics } from '@styles';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import AverageMoodsWeekBar from './AverageMoodsWeekBar';
import StatisticsSummaryRecords from './StatisticsSummaryRecords';
import WeeklyProgressChart from './WeeklyProgressChart';

export default function StatisticsBriefSection() {
    const handleDetailsPress = () => {
        router.push(routes.statistics);
    }

    return (
        <SectionContainer>
            <SectionHeader
                title={"Statystyki"}
                right={<Button title={"Szczegóły"} onPress={handleDetailsPress} />}
            />
            <View style={styles.row}>
                <View style={styles.column}>
                    <View style={styles.tile}>
                        <BodyBoldText style={styles.tileTitle} numberOfLines={1}>{"Podsumowanie"}</BodyBoldText>
                        <StatisticsSummaryRecords />
                    </View>
                    <View style={styles.tile}>
                        <BodyBoldText style={styles.tileTitle} numberOfLines={1}>{"Uśredniony nastrój"}</BodyBoldText>
                        <AverageMoodsWeekBar />
                    </View>
                </View>
                <View style={[styles.tile, styles.chartContainer]}>
                    <BodyBoldText style={styles.tileTitle} numberOfLines={1}>{"7-dniowy postęp"}</BodyBoldText>
                    <WeeklyProgressChart />
                </View>
            </View>
        </SectionContainer >
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: metrics.spacing.sm,
    },
    column: {
        flex: 1,
        flexDirection: 'column',
        gap: metrics.spacing.sm,
    },
    tile: {
        backgroundColor: colors.modalBackground,
        borderRadius: metrics.borderRadius.sm,
        paddingVertical: metrics.spacing.xs,
        paddingHorizontal: metrics.spacing.sm,
    },
    tileTitle: {
        marginBottom: metrics.spacing.xs,
        color: colors.darkGray,
    },
    chartContainer: {
        aspectRatio: '1',
        maxWidth: '50%',
        minHeight: '100%'
    },
    chartCenter: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
        alignItems: 'center',
        width: '70%',
    },
    completedText: {
        color: colors.lightSuccess,
    },
});
