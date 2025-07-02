import MoodActivityButton from "@components/activity/MoodActivityButton";
import { SubsectionHeader } from "@components/layout";
import { BodyBoldText, BodyText } from "@components/text";
import routes from "@constants/router";
import { NumberUtil } from "@utils/numberUtil";
import { router } from "expo-router";
import { View } from "react-native";

export default function ActionsNotesSubsection({ summary, styles }) {
    const {
        weekAvgNotesNumber,
        longestNoteLength,
        longestNoteReport,
    } = summary;

    const { humor, energy, note, date } = longestNoteReport || {};

    const longestNoteReportOnPress = () => {
        router.navigate(routes.editMoodByDate(date));
    };

    return (
        <View>
            <SubsectionHeader title="Notatki" />

            <BodyText style={styles.regularText}>
                {longestNoteReport ? <>
                    {'Średnio - '}
                    <BodyBoldText style={styles.summaryText}>
                        {NumberUtil.roundToMaxOneDecimal(weekAvgNotesNumber)}
                        {' / tydzień'}
                    </BodyBoldText>

                    {'\n'}

                    {'Najdłuższa - '}
                    <BodyBoldText style={styles.summaryText}>
                        {longestNoteLength}{' słowa'}
                    </BodyBoldText>
                </> : <>
                    {'Dodaj notatkę, aby zobaczyć podsumowanie.'}
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
