import HabitActivityButton from "@components/activity/HabitActivityButton";
import MoodActivityButton from "@components/activity/MoodActivityButton";
import TimeActivityButton from "@components/activity/TimeActivityButton";
import Button from "@components/input/Button";
import { INPUT_VARIANTS } from "@components/input/InputContainer";
import { SubsectionHeader } from "@components/layout";
import { LabelText } from "@components/text";
import routes from "@constants/router";
import { genitiveMonths } from "@constants/time";
import { useHabits } from "@contexts/HabitsContext";
import { useReports } from "@contexts/ReportsContext";
import { useStateManager } from "@contexts/StateManagerContext";
import { colors, icons, metrics } from "@styles";
import { formatDate, validateTimestamp } from "@utils/dateUtil";
import { router } from "expo-router";
import { Image, StyleSheet, View } from "react-native";

export default function DailyActivitySubsection(props) {
    const { date, habitStatistics, moodReport, habitId } = props;
    const { activityRegistry } = useStateManager();
    const { habits } = useHabits();
    const { setHabitLog } = useReports();

    const allHabitsRegistryRecord = activityRegistry.getRecord(date).habits;
    const allDailyExecutions = habitStatistics && habitStatistics.executions;
    const listElements = [];

    if (!habitId) {
        listElements.push(
            <MoodActivityButton key="mood"
                humor={moodReport?.humor}
                energy={moodReport?.energy}
                isNote={!!moodReport?.note}
                isEmpty={!moodReport}
                // TODO: implement mood report edit screen or refactor current to handle date param, navigate there on press
                onPress={() => { }}
            />
        );
    }

    if (allDailyExecutions) {
        if (habitId) {
            Object.entries(allDailyExecutions)?.forEach(([dailyHabitId, dailyHabitExecutions], i) => {
                if (habitId !== dailyHabitId) {
                    return;
                }
                dailyHabitExecutions?.forEach((execution, j) => {
                    const time = formatDate(execution, 'shorttime');
                    listElements.push(
                        <TimeActivityButton key={`${i}${j}`} time={time} />
                    );
                })
            });
        } else {
            Object.keys(allDailyExecutions).forEach((dailyHabitId, i) => {
                const habit = habits.find(habit => habit.id === dailyHabitId);
                if (!habit) {
                    return;
                }
                const { type, name } = habit.details;
                const { goal, completed } = allHabitsRegistryRecord[dailyHabitId];
                const onPress = () => router.push(routes.habitDetails(dailyHabitId));
                listElements.push(
                    <HabitActivityButton
                        key={i}
                        type={type}
                        name={name}
                        goal={goal}
                        completed={completed}
                        onPress={onPress}
                    />
                );
            })
        }
    }

    if (habitId) {
        const handleAddExecution = async () => {
            const currentExecutions = allDailyExecutions[habitId];
            const newExecutions = [...currentExecutions, new Date().getTime()];

            await setHabitLog(date, { id: habitId, executions: newExecutions });
        }

        listElements.push(
            <Button
                key="add-execution-button"
                icon={icons.plus}
                onPress={handleAddExecution}
                variant={INPUT_VARIANTS.PRIME}
            />
        )
    }

    const validDate = validateTimestamp(date);
    const remaining = Math.max(0, habitStatistics.goal - habitStatistics.completed);

    return (
        <View style={{ width: '100%' }}>
            <SubsectionHeader
                title="Akcje"
                badge={
                    <LabelText style={styles.dateText}>
                        {`${validDate.getDate()} ${genitiveMonths[validDate.getMonth()]}`}
                    </LabelText>
                }
                right={
                    <View style={styles.remainingContainer}>
                        <LabelText style={styles.remainingText}>POZOSTAŁO {remaining}</LabelText>
                        <Image source={icons.refresh} style={styles.remainingIcon} tintColor={styles.remainingIcon.color} />
                    </View>
                }
            />
            <View style={styles.listContainer}>{
                listElements.length
                    ? listElements
                    : <LabelText>Nic nie zrobiłeś, leniu śmierdzący!</LabelText>
            }</View>
        </View>
    )
}

const styles = StyleSheet.create({
    dateText: {
        color: colors.primBlue,
    },
    remainingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: metrics.spacing.xs,
    },
    remainingText: {
        color: colors.midGray,
    },
    remainingIcon: {
        width: metrics.imageSize.xs,
        height: metrics.imageSize.xs,
        color: colors.midGray,
    },
    listContainer: {
        width: '100%',
        flexDirection: 'row',
        gap: metrics.spacing.sm,
        flexWrap: 'wrap',
        justifyContent: 'flex-start'
    },
});
