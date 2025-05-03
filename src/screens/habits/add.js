import Button, { LOADING_ICON } from '@components/input/Button';
import { INPUT_SIZES, INPUT_VARIANTS } from '@components/input/InputContainer';
import { ScreenContainer } from '@components/layout';
import routes from '@constants/router';
import { useHabits } from '@contexts/HabitsContext';
import { HabitBuilder } from '@models/habit/Habit';
import { ModalService } from '@services/modalService';
import { icons, metrics } from '@styles';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import EditAvatarSection from './sections/EditAvatarSection';
import EditDetailsSection from './sections/EditDetailsSection';
import EditGoalSection from './sections/EditGoalSection';
import EditRemindersSection from './sections/EditRemindersSection';

export default function AddHabitScreen() {
	const { saveHabit, isLoading } = useHabits();
	const [builderErrors, setBuilderErrors] = useState([]);
	const [createdHabit, setCreatedHabit] = useState(null);

	const habitBuilder = useMemo(() => {
		const hb = new HabitBuilder();
		hb.setErrors = (newErrors) => setBuilderErrors(newErrors);
		return hb;
	}, []);

	const isSubmitted = useMemo(() => isLoading || createdHabit, [isLoading, createdHabit]);
	const isError = useMemo(() => builderErrors.length > 0, [builderErrors]);

	const buttonIcon = useMemo(() => (
		isSubmitted ? LOADING_ICON : icons.check
	), [isSubmitted]);

	const buttonVariant = useMemo(() => (
		(isError || isSubmitted) ? INPUT_VARIANTS.DISABLED : INPUT_VARIANTS.PRIME
	), [isError, isSubmitted]);

	const handleAdd = async () => {
		try {
			let habit = habitBuilder.build();

			if (!isSubmitted && !isError) {
				setCreatedHabit(await saveHabit(habit));
			}
		} catch (error) {
			ModalService.showError(error.message);
		}
	}

	useEffect(() => {
		if (createdHabit && !isLoading) {
			setCreatedHabit(null);
			router.replace(routes.habitDetails(createdHabit.id));
		}
	}, [createdHabit, isLoading]);

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

				onPress={handleAdd}
				style={{ marginTop: metrics.spacing.md, alignSelf: 'center' }}
			/>
		</ScreenContainer>
	);
}
