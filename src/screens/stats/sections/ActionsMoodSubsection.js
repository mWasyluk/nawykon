import MoodActivityButton from "@components/activity/MoodActivityButton";
import { SubsectionHeader } from "@components/layout";
import { BodyBoldText, BodyText } from "@components/text";
import routes from "@constants/router";
import { fullDays, pluralDays } from "@constants/time";
import { NumberUtil } from "@utils/numberUtil";
import { router } from "expo-router";
import { View } from "react-native";

export default function ActionsMoodSubsection({ summary, styles }) {
    const {
        weekAvgReportsNumber,
        bestMoodDaysOfWeek,
        bestMoodDayOfPreviousWeek,
        bestMoodDayOfPreviousWeekReport,
    } = summary;

    const pluralDaysOfWeek = bestMoodDaysOfWeek.map(dayOfWeek => pluralDays[dayOfWeek].toLowerCase());
    const daysOfWeekString = pluralDaysOfWeek.join(', ');
    const { humor, energy, note, date } = bestMoodDayOfPreviousWeekReport || {};

    const bestMoodReportOnPress = () => {
        router.navigate(routes.editMoodByDate(date));
    };

    return (
        <View>
            <SubsectionHeader title="Nastrój" />

            <BodyText style={styles.regularText}>
                {'Każdego tygodnia dodajesz średnio '}
                <BodyBoldText style={styles.summaryText}>
                    {NumberUtil.roundToMaxOneDecimal(weekAvgReportsNumber)}{' raportów nastoju'}
                </BodyBoldText>

                {daysOfWeekString && <>
                    {'. Najlepszy humor odnotowujesz '}
                    <BodyBoldText style={styles.summaryText}>
                        {'w '}{daysOfWeekString}
                    </BodyBoldText>
                </>}

                {bestMoodDayOfPreviousWeek
                    ? <>
                        {', a ostatni taki dzień w poprzednim tygodniu to '}
                        <BodyBoldText style={styles.summaryText}>
                            {fullDays[bestMoodDayOfPreviousWeek].toLowerCase()}
                        </BodyBoldText>
                        {'.'}
                    </> : <>
                        {'. Dodaj więcej raportów, aby zobaczyć dokładniejszą analizę.'}
                    </>}
            </BodyText>

            {bestMoodDayOfPreviousWeekReport && (
                <View style={{ flexDirection: 'row' }}>
                    <MoodActivityButton
                        humor={humor}
                        energy={energy}
                        isNote={!!note}
                        date={date}
                        onPress={bestMoodReportOnPress}
                    />
                </View>
            )}
        </View >
    );
}
