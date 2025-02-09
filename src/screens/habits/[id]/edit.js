import Button from '@components/ui/Button';
import routes from '@data/router';
import { HabitBuilder } from '@models/habit/Habit';
import { icons } from '@styles';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import { useModal } from 'src/context/ModalContext';
import { useHabits } from 'src/context/HabitsContext';
import HabitDetailsSection from '../sections/add/HabitDetailsSection';
import HabitGoalSection from '../sections/add/HabitGoalSection';
import HabitReminderSection from '../sections/add/HabitReminderSection';
import PickHabitSection from '../sections/add/PickHabitSection';

export default function EditHabitScreen() {
    const { id } = useLocalSearchParams();
    const { habits, updateHabit } = useHabits();
    const { showError } = useModal();
    const [builderErrors, setBuilderErrors] = useState([]);

    const currentHabit = useMemo(() => {
        return habits.find(habit => habit.id === id)
    }, [habits, id]);

    const habitBuilder = useMemo(() => {
        const hb = new HabitBuilder(currentHabit);
        hb.setErrors = (newErrors) => setBuilderErrors(newErrors);
        return hb;
    }, [currentHabit]);

    const handleHabitSave = () => {
        try {
            updateHabit(habitBuilder.build());
            router.push(routes.habitDetails(id));
        } catch (error) {
            showError(error.message);
        }
    }

    return (
        <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
            <PickHabitSection
                habitBuilder={habitBuilder}
            />
            <HabitDetailsSection
                habitBuilder={habitBuilder}
            />
            <HabitGoalSection
                habitBuilder={habitBuilder}
            />
            <HabitReminderSection
                habitBuilder={habitBuilder}
            />
            <Button
                title={"Zapisz"}
                icon={icons.check}
                onPress={handleHabitSave}
                style={{ marginVertical: 20 }}
                disabled={builderErrors.length > 0}
            />
        </ScrollView>
    );
}
