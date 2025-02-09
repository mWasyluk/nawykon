import { ActivitySection } from '@components/sections/activity/ActivitySection';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';
import { useModal } from 'src/context/ModalContext';
import { useHabits } from 'src/context/HabitsContext';
import HabitDetailsSection from '../sections/[id]/HabitDetailsSection';

export default function HabitDetailsScreen() {
    const { id } = useLocalSearchParams();
    const { habits } = useHabits();
    const { showError } = useModal();

    const currentHabit = habits.find((habit) => habit.id === id);

    if (!currentHabit) {
        showError('Nie odnaleziono informacji o nawyku. Spróbuj ponownie.');
        return null;
    }

    return (
        <ScrollView>
            <HabitDetailsSection
                id={currentHabit.id}
                name={currentHabit.details.name}
                description={currentHabit.details.description}
                type={currentHabit.details.type}
            />
            <ActivitySection habitId={id} />
        </ScrollView>
    );
}
