import Button from '@components/ui/Button';
import routes from '@data/router';
import { icons } from '@styles';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { useHabits } from 'src/context/HabitsContext';
import PickHabitSection from '../sections/add/PickHabitSection';
import HabitDetailsSection from '../sections/add/HabitDetailsSection';
import HabitGoalSection from '../sections/add/HabitGoalSection';
import HabitReminderSection from '../sections/add/HabitReminderSection';
import { Habit } from '@models/habit/Habit';

export default function EditHabitScreen() {
    const { id } = useLocalSearchParams();
    const { habits, updateHabit } = useHabits();
    const [isSaveReady, setIsSaveReady] = useState(false);
    const [currentHabit, setCurrentHabit] = useState(habits.find(habit => habit.id === id));

    const handleTypeChange = useCallback((type) => {
        setCurrentHabit({ ...currentHabit, details: { ...currentHabit.details, type } });
    }, []);

    const handleDetailsChange = useCallback((details) => {
        setCurrentHabit({ ...currentHabit, details: { ...currentHabit.details, ...details } });
    }, []);

    const handleGoalChange = useCallback((goal) => {
        setCurrentHabit({ ...currentHabit, goal });
    }, []);

    const handleRemindersChange = useCallback((reminders) => {
        setCurrentHabit({ ...currentHabit, reminders });
    }, []);

    const handleHabitSave = () => {
        updateHabit(new Habit(currentHabit));
    }

    useEffect(() => {
        const verifyHabit = () => {
            try {
                new Habit(currentHabit);
                setIsSaveReady(true);
            } catch (err) {
                setIsSaveReady(false);
            }
        }

        verifyHabit();
    }, [currentHabit]);

    return (
        <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
            <PickHabitSection
                defaultType={currentHabit.details.type}
                onChange={handleTypeChange}
            />
            <HabitDetailsSection
                defaultName={currentHabit.details.name}
                defaultDescription={currentHabit.details.description}
                onChange={handleDetailsChange}
            />
            <HabitGoalSection
                defaultGoal={currentHabit.goal}
                onChange={handleGoalChange}
            />
            <HabitReminderSection
                defaultReminders={currentHabit.reminders}
                onChange={handleRemindersChange} />
            <Button
                title={"Zapisz"}
                icon={icons.check}
                onPress={handleHabitSave}
                href={routes.dashboard}
                style={{ marginVertical: 20 }}
                disabled={!isSaveReady}
            />
        </ScrollView>
    );
}
