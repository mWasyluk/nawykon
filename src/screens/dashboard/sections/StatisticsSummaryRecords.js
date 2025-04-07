import { BodyBoldText, BodyText } from "@components/text";
import { useHabits } from "@contexts/HabitsContext";
import { useReports } from "@contexts/ReportsContext";
import { useStateManager } from "@contexts/StateManagerContext";
import { colors, icons, metrics } from "@styles";
import { ActivityUtil } from "@utils/activityUtil";
import { Image, View } from "react-native";

function StatisticsSummaryRecord(props) {
    const {
        icon,
        value,
        title,
    } = props;

    return (
        <View style={{ flexDirection: "row", alignItems: "center", gap: metrics.spacing.xs }}>
            <Image source={icon} style={{ width: metrics.imageSize.xs, height: metrics.imageSize.xs }} />
            <BodyBoldText style={{ color: colors.darkGray }}>{value}</BodyBoldText>
            <BodyText style={{ color: colors.midGray, textTransform: "uppercase" }}>{title}</BodyText>
        </View>
    );
}

export default function StatisticsSummaryRecords() {
    const { habits } = useHabits();
    const { dailyReports } = useReports();
    const { activityRegistry } = useStateManager();

    const habitsCount = habits.length;
    const moodReportsCount = dailyReports.filter(report => !!report.mood).length;

    const allRecords = activityRegistry.getRecords();
    const totalPoints = ActivityUtil.calculateHabitPoints(allRecords);
    const totalActionsNumber = ActivityUtil.calculateActionsNumber(allRecords);

    return (
        <>
            <StatisticsSummaryRecord icon={icons.mood} value={moodReportsCount} title={"raportów"} />
            <StatisticsSummaryRecord icon={icons.goal} value={habitsCount} title={"nawyków"} />
            <StatisticsSummaryRecord icon={icons.point} value={totalPoints} title={"punktów"} />
            <StatisticsSummaryRecord icon={icons.puzzle} value={totalActionsNumber} title={"akcji"} />
        </>
    );
}
