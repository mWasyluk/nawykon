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
                {firstHabit ? <>
                    {'Suma utworzonych - '}
                    <BodyBoldText style={styles.summaryText}>
                        {totalNumber}
                    </BodyBoldText>
                </> : <>
                    {'Dodaj nawyk, aby zobaczyć podsumowanie.'}
                </>
                }

                {'\n'}

                {firstHabit && <>
                    {'Utworzenie pierwszego - '}
                    <BodyBoldText style={styles.summaryText}>
                        {startDate}
                    </BodyBoldText>
                </>
                }
            </BodyText>

            {firstHabit && (
                <View style={{ flexDirection: 'row' }}>
                    <HabitActivityButton
                        type={firstHabit.details.type}
                        name={firstHabit.details.name}
                        color={firstHabit.details.color}
                        points={firstHabitPoints}
                        onPress={firstHabitOnPress}
                    />
                </View>
            )}
        </View>
    );
}
