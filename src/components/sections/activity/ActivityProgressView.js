import LineChart from "@components/charts/LineChart";
import { fontStyles, icons } from "@styles";
import { validateTimestamp } from "@utils/dateUtil";
import { Image, Text } from "react-native";
import { View } from "react-native";

export const ActivityProgressView = (props) => {
    const {
        dailyStats = {},
    } = props;

    const progressData = Object.entries(dailyStats).map(([date, stats]) => ({
        x: validateTimestamp(date).getDate(),
        y: stats.status == 'neutral' ? undefined : stats.status === 'completed' ? 1 : stats.status === 'failed' ? -1 : 0,
    }));

    const points = progressData.reduce((acc, point) => point.y ? acc + point.y : acc, 0);
    const pointsText = points > 0 ? `+${points}` : points;

    return (
        <View style={{ width: '100%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: -10 }}>
                <Text style={{ ...fontStyles.regularBold }}>Postęp</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ ...fontStyles.regularBold }}>{pointsText}</Text>
                    <Image source={icons.point} style={{ width: 32, height: 32 }} />
                </View>
            </View>

            <LineChart
                data={progressData}
            />
        </View>
    );
}
