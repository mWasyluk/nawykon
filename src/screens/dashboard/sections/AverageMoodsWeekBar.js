import { CaptionText } from "@components/text";
import { fullDays } from "@constants/time";
import { useStateManager } from "@contexts/StateManagerContext";
import { icons, metrics } from "@styles";
import { ActivityUtil } from "@utils/activityUtil";
import { Image, View } from "react-native";

function MoodRecord(props) {
    const {
        day,
        mood = undefined,
    } = props;

    const dayName = fullDays[day].slice(0, 2);

    const isMood = Number.isInteger(mood);
    const moodIcon = icons[`mood${isMood ? mood : ''}`];
    const moodIconStyle = {
        width: metrics.imageSize.md,
        height: metrics.imageSize.md,
        filter: isMood ? undefined : "grayscale(100%)",
        marginBottom: -5,
    }

    return (
        <View style={{ alignItems: "center", flex: 1 }}>
            <Image source={moodIcon} style={moodIconStyle} />
            <CaptionText>{dayName}</CaptionText>
        </View>
    );
}

export default function AverageMoodsWeekBar() {
    const { activityRegistry } = useStateManager();

    const weeklyMoodsArray = ActivityUtil.calculateAverageMoodsWeek(activityRegistry.getRecords());

    return (
        <View style={{ flexDirection: 'row' }}>
            {weeklyMoodsArray.map(({ day, avgMood }, index) => {
                return (
                    <MoodRecord
                        key={`avg-mood-day-record-${index}`}
                        day={day}
                        mood={Math.round(avgMood)}
                    />
                )
            })}
        </View>
    );
}
