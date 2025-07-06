import HabitCard from "@components/habit/HabitCard";
import Button from "@components/input/Button";
import { INPUT_VARIANTS } from "@components/input/InputContainer";
import { SectionContainer, SectionHeader, TabToggle } from "@components/layout";
import routes from "@constants/router";
import { useActivity } from "@contexts/ActivitiesContext";
import { useHabits } from "@contexts/HabitsContext";
import { useReports } from "@contexts/ReportsContext";
import { Habit } from "@models/habit/Habit";
import { ModalService } from "@services/modalService";
import { icons } from "@styles";
import { formatDate } from "@utils/dateUtil";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";

export default function HabitsListSection() {
    const { habits } = useHabits();
    const { setHabitLog } = useReports();
    const { activityRegistry } = useActivity();

    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [isAdding, setIsAdding] = useState(false);

    const todaysActivityRecord = useMemo(() => activityRegistry.getRecord(new Date()), [activityRegistry]);

    const tabs = useMemo(() => [
        { name: "Aktywne", onPress: () => setActiveTabIndex(1), habitsFilter: (habit) => habit.status === Habit.STATUSES.ACTIVE },
        { name: "Ukończone", onPress: () => setActiveTabIndex(2), habitsFilter: (habit) => habit.status === Habit.STATUSES.INACTIVE },
        { name: "Wszystkie", onPress: () => setActiveTabIndex(0), habitsFilter: () => true },
    ], []);

    const activeTab = useMemo(() => tabs[activeTabIndex], [activeTabIndex]);
    const activeHabits = useMemo(() => habits.filter(activeTab?.habitsFilter), [activeTab, habits]);

    const habitCardPropsArray = useMemo(() => {
        return activeHabits.map(habit => {
            const cardProps = {
                // details,
                // streak,
                // goal,
                // completed,
                // addExecution,
                // onPress,
            };

            cardProps.details = habit.details;
            cardProps.streak = habit.streak;

            const {
                executions: currentExecutionsArray = [],
                goal = 0,
                completed = 0
            } = todaysActivityRecord.habits[habit.id] || {};

            cardProps.goal = goal;
            cardProps.completed = Math.min(completed, goal);

            cardProps.addExecution = () => {
                if (cardProps.completed >= cardProps.goal || isAdding) {
                    return;
                }
                try {
                    setIsAdding(habit.id);
                    let newExecutionsArray = [...currentExecutionsArray, new Date().getTime()];
                    const date = formatDate(new Date(), 'date');
                    setHabitLog(date, { id: habit.id, executions: newExecutionsArray });
                } catch (error) {
                    ModalService.showError(error.message);
                }
            };

            cardProps.isLoading = isAdding === habit.id;

            cardProps.onPress = () => {
                router.push(routes.habitDetails(habit.id));
            }

            return cardProps;
        }) // sort by name and goal, prioritize goal
            .sort((a, b) => a.details.name.localeCompare(b.details.name))
            .sort((a, b) => b.goal - a.goal);
    }, [activeHabits, todaysActivityRecord, isAdding]);

    useEffect(() => {
        setIsAdding(false);
    }, [activityRegistry]);

    const handleAddPress = () => {
        router.push(routes.newHabit);
    }

    return (
        <SectionContainer>
            <SectionHeader
                title={"Nawyki"}
                badge={<TabToggle name={activeTab.name} onPress={activeTab.onPress} />}
                right={<Button
                    title={"Dodaj"}
                    icon={icons.plus}
                    variant={INPUT_VARIANTS.PRIME}
                    onPress={handleAddPress}
                />}
            />
            {habitCardPropsArray.map((props, index) => (
                <HabitCard key={index} {...props} />
            ))}
        </SectionContainer>
    );
}
