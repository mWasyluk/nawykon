import Button, { LOADING_ICON } from '@components/input/Button';
import { INPUT_SIZES, INPUT_VARIANTS } from '@components/input/InputContainer';
import { ScreenContainer } from '@components/layout';
import routes from '@constants/router';
import { useHabits } from '@contexts/HabitsContext';
import { HabitBuilder } from '@models/habit/Habit';
import { ModalService } from '@services/modalService';
import { icons, metrics } from '@styles';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import EditAvatarSection from '../sections/EditAvatarSection';
import EditDetailsSection from '../sections/EditDetailsSection';
import EditGoalSection from '../sections/EditGoalSection';
import EditRemindersSection from '../sections/EditRemindersSection';

export default function EditHabitScreen() {
    const { id } = useLocalSearchParams();
    const { habits, updateHabit, isLoading } = useHabits();
    const [builderErrors, setBuilderErrors] = useState([]);
    const [isUpdated, setIsUpdated] = useState(null);

    const currentHabit = useMemo(() => {
        return habits.find(habit => habit.id === id)
    }, [habits, id]);

    const habitBuilder = useMemo(() => {
        const hb = new HabitBuilder(currentHabit);
        hb.setErrors = (newErrors) => setBuilderErrors(newErrors);
        return hb;
    }, [currentHabit]);

    const isSubmitted = useMemo(() => isLoading || isUpdated, [isLoading, isUpdated]);
    const isError = useMemo(() => builderErrors.length > 0, [builderErrors]);

    const buttonIcon = useMemo(() => (
        isSubmitted ? LOADING_ICON : icons.check
    ), [isSubmitted]);

    const buttonVariant = useMemo(() => (
        (isError || isSubmitted) ? INPUT_VARIANTS.DISABLED : INPUT_VARIANTS.PRIME
    ), [isError, isSubmitted]);

    const handleUpdate = async () => {
        try {
            let habit = habitBuilder.build();

            if (!isSubmitted && !isError) {
                await updateHabit(habit);
                setIsUpdated(true);
            }
        } catch (error) {
            ModalService.showError(error.message);
        }
    }

    useEffect(() => {
        if (isUpdated && !isLoading) {
            setIsUpdated(false);
            router.replace(routes.habitDetails(id));
        }
    }, [isUpdated, isLoading]);

    return (
        <ScreenContainer>
            <EditAvatarSection habitBuilder={habitBuilder} />
            <EditDetailsSection habitBuilder={habitBuilder} />
            <EditGoalSection habitBuilder={habitBuilder} />
            <EditRemindersSection habitBuilder={habitBuilder} />

            <Button
                title={"Zapisz"}
                icon={buttonIcon}
                variant={buttonVariant}
                size={INPUT_SIZES.LARGE}

                onPress={handleUpdate}
                style={{ marginTop: metrics.spacing.md, alignSelf: 'center' }}
            />
        </ScreenContainer>
    );
}
