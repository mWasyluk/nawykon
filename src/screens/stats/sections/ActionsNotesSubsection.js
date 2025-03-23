import MoodActivityButton from "@components/activity/MoodActivityButton";
import { SubsectionHeader } from "@components/layout";
import { BodyBoldText, BodyText } from "@components/text";
import { NumberUtil } from "@utils/numberUtil";
import { View } from "react-native";

export default function ActionsNotesSubsection({ summary, styles }) {
    const {
        weekAvgNotesNumber,
        longestNoteLength,
        longestNoteReport,
    } = summary;

    // TODO: update after mood report edit screen is implemented
    const longestNoteReportOnPress = () => { };
    const { humor, energy, note, date } = longestNoteReport || {};

    return (
        <View>
            <SubsectionHeader title="Nastrój" />

            <BodyText style={styles.regularText}>
                {'Każdego tygodnia dodajesz średnio '}
                <BodyBoldText style={styles.summaryText}>
                    {NumberUtil.roundToMaxOneDecimal(weekAvgNotesNumber)}{' notatek'}
                </BodyBoldText>
                {longestNoteReport
                    ? <>
                        {'. Najdłuższa notatka miała '}
                        <BodyBoldText style={styles.summaryText}>
                            {longestNoteLength}{' słowa'}
                        </BodyBoldText>
                        {'.'}
                    </> : <>
                        {'. Dodaj pierwszą notatkę do raportu, aby zobaczyć dokładniejszą analizę.'}
                    </>}
            </BodyText>

            {longestNoteReport && (
                <View style={{ flexDirection: 'row' }}>
                    <MoodActivityButton
                        humor={humor}
                        energy={energy}
                        isNote={!!note}
                        date={date}
                        onPress={longestNoteReportOnPress}
                    />
                </View>
            )}
        </View >
    );
}
