import ActivityValueIcon from "@components/activity/ActivityValueIcon";
import PieChart from "@components/charts/PieChart";
import { BodyBoldText } from "@components/text";
import { useActivity } from "@contexts/ActivitiesContext";
import { colors, icons } from "@styles";
import { ActivityUtil } from "@utils/activityUtil";
import { StyleSheet, View } from "react-native";

export default function WeeklyProgressChart() {
    const { activityRegistry } = useActivity();

    const todaysDate = new Date();
    const weekAgoDate = new Date(new Date().setDate(todaysDate.getDate() - 6));

    const weeklyRecords = activityRegistry.getRecords(weekAgoDate, todaysDate);
    const weeklyStatistics = ActivityUtil.calculateHabitStatistics(weeklyRecords);
    const chartData = [
        { value: weeklyStatistics.completed, color: colors.lightSuccess },
        { value: weeklyStatistics.partial, color: colors.lightWarning },
        { value: weeklyStatistics.failed, color: colors.lightError },
    ]

    const points = weeklyStatistics.points;
    const pointsValue = points > 0 ? `+${points}` : points;

    return (
        <View style={{ flex: 1 }}>
            <PieChart
                data={chartData}
            />
            <View style={styles.pieChartCenter}>
                <BodyBoldText style={styles.completedText} numberOfLines={1}>
                    {`${weeklyStatistics.completed} ukończonych`}
                </BodyBoldText>
                <ActivityValueIcon value={pointsValue} icon={icons.point} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    pieChartCenter: {
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
