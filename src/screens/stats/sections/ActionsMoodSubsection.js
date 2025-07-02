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
            <SubsectionHeader title="Humor" />

            <BodyText style={styles.regularText}>
                {bestMoodDaysOfWeek.length > 0 ? <>
                    {'Średnio - '}
                    <BodyBoldText style={styles.summaryText}>
                        {NumberUtil.roundToMaxOneDecimal(weekAvgReportsNumber)}
                        {' / tydzień'}
                    </BodyBoldText>

                    {'\n'}

                    {'Najlepszy - '}
                    <BodyBoldText style={styles.summaryText}>
                        {daysOfWeekString}
                    </BodyBoldText>

                    {'\n'}

                    {'Najlepszy (poprz. tydzień) - '}
                    <BodyBoldText style={styles.summaryText}>
                        {bestMoodDayOfPreviousWeek ? fullDays[bestMoodDayOfPreviousWeek].toLowerCase() : 'brak danych'}
                    </BodyBoldText>
                </> : <>
                    {'Dodaj raport, aby zobaczyć podsumowanie.'}
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
