import routes from '@constants/router';
import { useHabits } from '@contexts/HabitsContext';
import { useStateManager } from '@contexts/StateManagerContext';
import ActivitySection from '@screens/commons/activity/ActivitySection';
import PointsSection from '@screens/commons/activity/PointsSection';
import { ModalService } from '@services/modalService';
import { metrics } from '@styles';
import { ActivityUtil } from '@utils/activityUtil';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import ViewDetailsSection from '../sections/ViewDetailsSection';

export default function HabitDetailsScreen() {
    const { id } = useLocalSearchParams();
    const { habits } = useHabits();
    const { activityRegistry } = useStateManager();

    const currentHabit = useMemo(() => habits.find((habit) => habit.id === id), [habits])

    if (!currentHabit) {
        ModalService.showError('Nie odnaleziono informacji o nawyku. Za chwilę przeniosę Cię na stronę główną...');
        setTimeout(() => {
            router.push(routes.home);
        }, 3000);
        return null;
    }

    const allRecords = activityRegistry.getRecords();
    const { points } = ActivityUtil.calculateHabitStatistics(allRecords, id);

    return (
        <ScrollView>
            <ViewDetailsSection
                habit={currentHabit}
            />
            <ActivitySection habitId={id} />
            <PointsSection habitId={id} />
            <View style={{ height: metrics.spacing.md }} />
        </ScrollView>
    );
}
