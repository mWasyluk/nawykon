import ScreenSection from "@components/containers/ScreenSection";
import HabitCard from "@components/habit/HabitCard";
import Button from "@components/ui/Button";
import routes from "@data/router";
import { icons } from "@styles";
import { formatDate } from "@utils/dateUtil";
import { router } from "expo-router";
import { useHabits } from "src/context/HabitsContext";
import { useReports } from "src/context/ReportsContext";

export default function HabitsListSection() {
    const { habits } = useHabits();
    const { habitReports, editHabitReport } = useReports();

    // collect reports with todays date
    const todaysReports = habitReports.map(report => {
        if (formatDate(report.date) === formatDate(new Date())) {
            return report;
        }
    });

    // prepare data for habit cards based on habits and reports
    const habitListObjects = habits.map(habit => {
        var requiredExecutions = 0;
        var remainedExecutions = 0;

        const habitReport = todaysReports.find(report => habit.id === report.habitId);

        if (habitReport && habitReport.goal) {
            requiredExecutions = habitReport.goal;
            remainedExecutions = habitReport.goal - habitReport.executions.length;
            remainedExecutions = remainedExecutions < 0 ? 0 : remainedExecutions;
        }

        const addExecution = () => {
            try {
                habitReport.addExecution();
                editHabitReport(habitReport);
            } catch (error) {
                console.error(error);
            }
        }

        return {
            onPress: () => router.push(routes.habitDetails(habit.id)),
            onCheck: () => remainedExecutions > 0 ? addExecution() : () => { },
            type: habit.details.type,
            name: habit.details.name,
            description: habit.details.description,
            streak: habit.streak,
            requiredExecutions,
            remainedExecutions,
        }
    }).sort((a, b) => b.remains - a.remains);

    return (
        <ScreenSection
            title={"Nawyki"}
            rightComponent={
                <Button href={routes.newHabit}
                    title={"Nowy"}
                    icon={icons.plus}
                    small={true} />
            }>
            {habitListObjects?.map((obj, index) => (
                <HabitCard key={index} {...obj} />
            ))}
        </ScreenSection>
    );
}
