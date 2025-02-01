import { useEffect, useState } from 'react';
import { useHabits } from './src/context/HabitsContext'; // Example context
import { useReports } from './src/context/ReportsContext'; // Example context
import { ExpoRoot } from 'expo-router';
import { Text } from 'react-native';
import { useUser } from 'src/context/UserContext';
import { formatDate } from '@utils/dateUtil';

const ctx = require.context("./src/screens");

export default function App() {
    const { user } = useUser();
    const { habits, isLoading: isHabitsLoading, error: habitsError } = useHabits();
    const { habitReports, createHabitReports, isLoading: isReportsLoading, error: reportsError } = useReports();
    const [areReportsReady, setAreReportsReady] = useState(false);

    useEffect(() => {
        const handleMidnight = () => {
            const now = new Date();
            const timeUntilMidnight =
                new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();

            setTimeout(async () => {
                await createHabitReports(habits);
                handleMidnight(); // Reset timer for the next day
            }, timeUntilMidnight);
        };

        handleMidnight(); // Start midnight rerender logic
    }, []);

    useEffect(() => {
        if (isHabitsLoading || isReportsLoading || habitsError || reportsError)
            return; // Do not run logic if loading or error

        const habitsWithoutReport = habits.filter(habit =>
            !habitReports.some(report =>
                report.habitId === habit.id && formatDate(report.date) === formatDate(new Date())
            )
        );

        if (habitsWithoutReport.length > 0) {
            createHabitReports(habitsWithoutReport);
        }

        setAreReportsReady(true);
    }, [habits, habitReports]);

    if (isHabitsLoading || isReportsLoading) {
        return <Text>Loading {isHabitsLoading ? 'habits' : 'reports'}...</Text>;
    }

    if (habitsError || reportsError) {
        return <Text>{habitsError ? "Habits error: " + habitsError.message : "Reports error: " + reportsError.message}</Text>;
    }

    if (!areReportsReady) {
        return <Text>Generating reports...</Text>;
    }

    // console.info('--- App context ---',);
    // console.info('User:', user);
    // console.info('Habits:', habits);
    // console.info('Habit Reports:', habitReports);
    // console.info('-----------------',);

    return <ExpoRoot context={ctx} />;
};
