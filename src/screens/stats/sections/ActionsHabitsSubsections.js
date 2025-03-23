import HabitActivityButton from "@components/activity/HabitActivityButton";
import { SubsectionHeader } from "@components/layout";
import { BodyBoldText, BodyText } from "@components/text";
import routes from "@constants/router";
import { router } from "expo-router";
import { View } from "react-native";

export default function ActionsHabitsSubsections({ summary, styles }) {
    const {
        startDate,
        totalNumber,
        firstHabitExecutionsNumber,
        firstHabit,
        firstHabitPoints,
    } = summary;

    const firstHabitOnPress = () => { router.push(routes.habitDetails(firstHabit.id)) };

    return (
        <View>
            <SubsectionHeader title="Nawyki" />

            <BodyText style={styles.regularText}>
                {startDate ? <>
                    {'Od '}
                    <BodyBoldText style={styles.summaryText}>
                        {startDate}
                    </BodyBoldText>
                    {' utworzono '}
                    <BodyBoldText style={styles.summaryText}>
                        {totalNumber}{' nawyków'}
                    </BodyBoldText>
                </> : <>
                    {'Jeszcze nie utworzyłeś żadengo nawyku'}
                </>}

                {firstHabit ? <>
                    {'. Najstarszy z nich wykonałeś już '}
                    <BodyBoldText style={styles.summaryText}>
                        {firstHabitExecutionsNumber}{' razy'}
                    </BodyBoldText>
                    {'.'}
                </> : <>
                    {'. Dodaj pierwszy nawyk, aby zobaczyć dokładniejszą analizę.'}
                </>
                }
            </BodyText>

            {firstHabit && (
                <View style={{ flexDirection: 'row' }}>
                    <HabitActivityButton
                        type={firstHabit.details.type}
                        name={firstHabit.details.name}
                        points={firstHabitPoints}
                        onPress={firstHabitOnPress}
                    />
                </View>
            )}
        </View>
    );
}
