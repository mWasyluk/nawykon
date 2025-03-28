import Button from '@components/input/Button';
import { INPUT_SIZES, INPUT_VARIANTS } from '@components/input/InputContainer';
import { ScreenContainer } from '@components/layout';
import routes from '@constants/router';
import { useHabits } from '@contexts/HabitsContext';
import { HabitBuilder } from '@models/habit/Habit';
import { ModalService } from '@services/modalService';
import { icons, metrics } from '@styles';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import EditAvatarSection from '../sections/EditAvatarSection';
import EditDetailsSection from '../sections/EditDetailsSection';
import EditGoalSection from '../sections/EditGoalSection';
import EditRemindersSection from '../sections/EditRemindersSection';

export default function EditHabitScreen() {
    const { id } = useLocalSearchParams();
    const { habits, updateHabit } = useHabits();
    const [builderErrors, setBuilderErrors] = useState([]);

    const buttonVariant = useMemo(() => (
        builderErrors.length > 0 ? INPUT_VARIANTS.DISABLED : INPUT_VARIANTS.PRIME
    ), [builderErrors]);

    const currentHabit = useMemo(() => {
        return habits.find(habit => habit.id === id)
    }, [habits, id]);

    const habitBuilder = useMemo(() => {
        const hb = new HabitBuilder(currentHabit);
        hb.setErrors = (newErrors) => setBuilderErrors(newErrors);
        return hb;
    }, [currentHabit]);

    const handleUpdate = async () => {
        try {
            let habit = habitBuilder.build();

            if (buttonVariant !== INPUT_VARIANTS.DISABLED) {
                habit = await updateHabit(habit);
                router.push(routes.habitDetails(habit.id));
            }
        } catch (error) {
            ModalService.showError(error.message);
        }
    }

    return (
        <ScreenContainer>
            <EditAvatarSection habitBuilder={habitBuilder} />
            <EditDetailsSection habitBuilder={habitBuilder} />
            <EditGoalSection habitBuilder={habitBuilder} />
            <EditRemindersSection habitBuilder={habitBuilder} />

            <Button
                title={"Zapisz"}
                icon={icons.check}
                variant={buttonVariant}
                size={INPUT_SIZES.LARGE}

                onPress={handleUpdate}
                style={{ marginTop: metrics.spacing.md, alignSelf: 'center' }}
            />
        </ScreenContainer>
    );
}
