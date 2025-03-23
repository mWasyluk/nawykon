import HabitActivityButton from "@components/activity/HabitActivityButton";
import { SubsectionHeader } from "@components/layout";
import { BodyBoldText, BodyText } from "@components/text";
import routes from "@constants/router";
import { NumberUtil } from "@utils/numberUtil";
import { router } from "expo-router";
import { View } from "react-native";

export default function ActionsResultsSubsection({ summary, styles }) {
    const {
        weekAvgExecutionsNumber,
        favHabitWeekAvgExecutionsNumber,
        favHabit,
        favHabitPoints,
    } = summary;

    const favHabitOnPress = () => { router.push(routes.habitDetails(favHabit.id)) };

    return (
        <View>
            <SubsectionHeader title="Rezultaty" />

            <BodyText style={styles.regularText}>
                {'Każdego tygodnia wykonujesz średnio '}
                <BodyBoldText style={styles.summaryText}>
                    {NumberUtil.roundToMaxOneDecimal(weekAvgExecutionsNumber)}{' powtórzeń'}
                </BodyBoldText>
                {' nawyków'}

                {favHabit ? <>
                    {', a w typ jest '}
                    <BodyBoldText style={styles.summaryText}>
                        {NumberUtil.roundToMaxOneDecimal(favHabitWeekAvgExecutionsNumber)}{' powtórzeń'}
                    </BodyBoldText>
                    {' Twojego ulubionego nawyku.'}
                </> : <>
                    {'. Dodaj pierwszy nawyk, aby zobaczyć dokładniejszą analizę.'}
                </>
                }
            </BodyText>

            {favHabit && (
                <View style={{ flexDirection: 'row' }}>
                    <HabitActivityButton
                        type={favHabit.details.type}
                        name={favHabit.details.name}
                        points={favHabitPoints}
                        onPress={favHabitOnPress}
                    />
                </View>
            )}
        </View>
    );
}
