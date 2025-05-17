import HabitActivityButton from "@components/activity/HabitActivityButton";
import MoodActivityButton from "@components/activity/MoodActivityButton";
import Button, { LOADING_ICON } from "@components/input/Button";
import { INPUT_VARIANTS } from "@components/input/InputContainer";
import { SubsectionHeader } from "@components/layout";
import { LabelText } from "@components/text";
import routes from "@constants/router";
import { genitiveMonths } from "@constants/time";
import { useActivity } from "@contexts/ActivitiesContext";
import { useHabits } from "@contexts/HabitsContext";
import { useReports } from "@contexts/ReportsContext";
import { ModalService } from "@services/modalService";
import { colors, icons, metrics } from "@styles";
import { formatDate, validateTimestamp } from "@utils/dateUtil";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";

export default function DailyActivitySubsection(props) {
    const { date, habitStatistics, moodReport, habitId } = props;
    const { activityRegistry } = useActivity();
    const { habits } = useHabits();
    const { setHabitLog } = useReports();

    const [isAdding, setIsAdding] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    const allHabitsRegistryRecord = activityRegistry.getRecord(date).habits;
    const allDailyExecutions = habitStatistics && habitStatistics.executions;
    const listElements = [];

    if (!habitId) {
        const handleMoodButtonPress = () => {
            router.navigate(routes.editMoodByDate(date));
        }

        listElements.push(
            <MoodActivityButton
                key="mood-button"
                humor={moodReport?.humor}
                energy={moodReport?.energy}
                isNote={!!moodReport?.note}
                isEmpty={!moodReport}
                onPress={handleMoodButtonPress}
            />
        );
    }

    if (allDailyExecutions) {
        if (habitId) {
            const executions = allDailyExecutions[habitId] || [];
            executions.forEach((execution, j) => {
                const time = formatDate(execution, 'shorttime');

                const handleRemoveExecution = async () => {
                    setIsRemoving(execution);
                    const newExecutions = executions.filter(e => e !== execution);
                    await setHabitLog(date, { id: habitId, executions: newExecutions });
                }

                const showRemoveConfirmation = () => {
                    if (isRemoving) {
                        return;
                    }
                    ModalService.showConfirm(
                        `Czy chcesz trwale usunąć zapis wykonania nawyku z godziny ${time}?`,
                        handleRemoveExecution,
                    );
                }

                const buttonIcon = isRemoving === execution ? LOADING_ICON : icons.check;
                const buttonVariant = isRemoving === execution ? INPUT_VARIANTS.DISABLED : INPUT_VARIANTS.DEFAULT;

                listElements.push(
                    <Button
                        key={`execution-button-${j}`}
                        title={time}
                        icon={buttonIcon}
                        variant={buttonVariant}
                        onPress={showRemoveConfirmation}
                    />
                );
            })
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
                        key={`habit-button-${i}`}
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

    skipme: if (habitId) {
        const habit = habits.find(habit => habit.id === habitId);
        if (!habit) {
            break skipme;
        }
        const isFuture = date > formatDate(new Date(), 'date');
        const wasActive = (!habit.endDate || habit.endDate >= date) && formatDate(habit.createdAt, 'date') <= date;

        const handleAddExecution = async () => {
            if (isFuture) {
                ModalService.showError('Nie możesz dodać aktywności w przyszłości.');
                return;
            }
            if (!wasActive) {
                ModalService.showError('Nawyk był nieaktywny wybranego dnia.');
                return;
            }
            if (isAdding) {
                return;
            }
            setIsAdding(true);
            const currentExecutions = allDailyExecutions[habitId];
            const newExecutions = [...currentExecutions, new Date().getTime()];

            await setHabitLog(date, { id: habitId, executions: newExecutions });
        }

        const buttonIcon = isAdding ? LOADING_ICON : icons.plus;
        const buttonVariant = wasActive && !isFuture && !isAdding ? INPUT_VARIANTS.PRIME : INPUT_VARIANTS.DISABLED;

        listElements.push(
            <Button
                key="add-execution-button"
                icon={buttonIcon}
                variant={buttonVariant}
                onPress={handleAddExecution}
            />
        )
    }

    useEffect(() => {
        setIsAdding(false);
        setIsRemoving(false);
    }, [activityRegistry]);

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
