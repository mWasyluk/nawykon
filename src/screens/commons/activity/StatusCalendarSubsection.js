import { StatusCalendarView } from "@components/activity/StatusCalendarView";
import ActivityStatisticsValue, { VARIANTS } from "@components/activity/ActivityStatisticsValue";
import { SubsectionHeader } from "@components/layout";
import { metrics } from "@styles";
import { StyleSheet, View } from "react-native";

export default function StatusCalendarSubsection(props) {
    const {
        data,
        onSelectDate,
        selectedDate = null,
        completed = 0,
        failed = 0,
        partial = 0,
    } = props;
    return (
        <View>
            <SubsectionHeader title="Kalendarz statusów" />
            <View style={styles.container}>
                <View style={styles.calendarContainer}>
                    <StatusCalendarView data={data} onSelectDate={onSelectDate} selectedDate={selectedDate} />
                </View>
                <View style={styles.statisticsContainer}>
                    <ActivityStatisticsValue variant={VARIANTS.success} value={completed} label={'ukończonych'} />
                    <ActivityStatisticsValue variant={VARIANTS.partial} value={partial} label={'rozpoczętych'} />
                    <ActivityStatisticsValue variant={VARIANTS.fail} value={failed} label={'pominiętych'} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: metrics.spacing.sm,
        justifyContent: 'space-between',
    },
    calendarContainer: {
        width: '60%',
    },
    statisticsContainer: {
        justifyContent: 'center',
        gap: metrics.spacing.xs
    },
});
