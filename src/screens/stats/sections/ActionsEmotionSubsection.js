import MoodActivityButton from "@components/activity/MoodActivityButton";
import { SubsectionHeader } from "@components/layout";
import { BodyBoldText, BodyText } from "@components/text";
import { EMOTIONS } from "@constants/mood";
import routes from "@constants/router";
import { fullDays } from "@constants/time";
import { NumberUtil } from "@utils/numberUtil";
import { router } from "expo-router";
import { View } from "react-native";

export default function ActionsEmotionSubsection({ summary, styles }) {
    const {
        weekAvgNumber,
        mostFrequent,
        mostFrequentType,
        mostNegativeDayOfPreviousWeek,
        mostNegativeDayOfPreviousWeekReport,
    } = summary;

    const { humor, energy, note, date } = mostNegativeDayOfPreviousWeekReport || {};

    const worstEmotionReportOnPress = () => {
        router.navigate(routes.editMoodByDate(date));
    };

    return (
        <View>
            <SubsectionHeader title="Emocje" />

            <BodyText style={styles.regularText}>
                {mostFrequent ? <>
                    {'Średnio - '}
                    <BodyBoldText style={styles.summaryText}>
                        {NumberUtil.roundToMaxOneDecimal(weekAvgNumber)}
                        {' / tydzień'}
                    </BodyBoldText>

                    {'\n'}

                    {'Przeważające - '}
                    <BodyBoldText style={styles.summaryText}>
                        {mostFrequentType === 'positive' ? 'pozytywne' : 'negatywne'}
                    </BodyBoldText>

                    {'\n'}

                    {'Najczęstsza - '}
                    <BodyBoldText style={styles.summaryText}>
                        {EMOTIONS[mostFrequent].name.toLowerCase()}
                    </BodyBoldText>

                    {'\n'}

                    {'Najwięcej negatywnych (poprz. tydzień) - '}
                    <BodyBoldText style={styles.summaryText}>
                        {mostNegativeDayOfPreviousWeek
                            ? fullDays[mostNegativeDayOfPreviousWeek].toLowerCase()
                            : 'brak danych'}
                    </BodyBoldText>
                </> : <>
                    {'Dodaj emocje, aby zobaczyć podsumowanie.'}
                </>}
            </BodyText>

            {mostNegativeDayOfPreviousWeekReport && (
                <View style={{ flexDirection: 'row' }}>
                    <MoodActivityButton
                        humor={humor}
                        energy={energy}
                        isNote={!!note}
                        date={date}
                        onPress={worstEmotionReportOnPress}
                    />
                </View>
            )}

            {/* <BodyText style={styles.regularText}>
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
            )} */}
        </View >
    );
}
