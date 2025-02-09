import ScreenSection from "@components/containers/ScreenSection";
import HabitCard from "@components/habit/HabitCard";
import Button from "@components/ui/Button";
import routes from "@data/router";
import { icons } from "@styles";
import { formatDate } from "@utils/dateUtil";
import { router } from "expo-router";
import { useMemo } from "react";
import { useHabits } from "src/context/HabitsContext";
import { useReports } from "src/context/ReportsContext";
import { useStateManager } from "src/context/StateManagerContext";

export default function HabitsListSection() {
    const { habits } = useHabits();
    const { todaysReport, setHabitLog } = useReports();
    const { statistics } = useStateManager();

    const habitListObjects = useMemo(() => {
        if (!statistics) {
            return [];
        }

        const todayStats = statistics.getStatsByDateRange(todaysReport.date, todaysReport.date).dailyStats[todaysReport.date];
        const objects = [];
        habits.forEach(habit => {
            const habitStats = todayStats.habitStats[habit.id];

            // if (habitStats) {
            objects.push({
                onPress: () => router.push(routes.habitDetails(habit.id)),
                addExecution: () => {
                    try {
                        const executions = todaysReport.executions[habit.id] || [];
                        const newExecutions = [...executions, new Date().getTime()];
                        const date = formatDate(new Date(), 'date');
                        setHabitLog(date, { id: habit.id, executions: newExecutions });
                    } catch (error) {
                        console.error(error);
                    }
                },
                type: habit.details.type,
                name: habit.details.name,
                description: habit.details.description,
                streak: habit.streak,
                repetitions: habitStats?.goal,
                executions: habitStats?.completed,
            });
            // }
        });

        objects.sort((a, b) => b.repetitions - a.repetitions);
        return objects;
    }, [statistics]);

    return (
        <ScreenSection
            title={"Nawyki"}
            rightComponent={
                <Button href={routes.newHabit}
                    title={"Nowy"}
                    icon={icons.plus}
                    small={true} />
            }>
            {habitListObjects.map((obj, index) => (
                <HabitCard key={index} {...obj} />
            ))}
        </ScreenSection>
    );
}
