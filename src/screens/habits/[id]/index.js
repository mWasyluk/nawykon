import routes from '@constants/router';
import { useHabits } from '@contexts/HabitsContext';
import ActivitySection from '@screens/commons/activity/ActivitySection';
import PointsSection from '@screens/commons/activity/PointsSection';
import { metrics } from '@styles';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import ViewDetailsSection from '../sections/ViewDetailsSection';

export default function HabitDetailsScreen() {
    const { id } = useLocalSearchParams();
    const { habits, isLoading } = useHabits();

    const currentHabit = useMemo(() => habits.find((habit) => habit.id === id), [habits, id])

    useEffect(() => {
        if (!currentHabit && !isLoading) {
            setTimeout(() => {
                router.replace(routes.home);
            }, 10);
        }
    }, [currentHabit]);

    return (
        <ScrollView>
            {currentHabit && (
                <ViewDetailsSection
                    habit={currentHabit}
                />
            )}
            <ActivitySection habitId={id} />
            <PointsSection habitId={id} />
            <View style={{ height: metrics.spacing.md }} />
        </ScrollView>
    );
}
