import Button from '@components/input/Button';
import { INPUT_SIZES, INPUT_VARIANTS } from '@components/input/InputContainer';
import { ScreenContainer } from '@components/layout';
import routes from '@constants/router';
import { useHabits } from '@contexts/HabitsContext';
import { HabitBuilder } from '@models/habit/Habit';
import { ModalService } from '@services/modalService';
import { icons, metrics } from '@styles';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import EditAvatarSection from './sections/EditAvatarSection';
import EditDetailsSection from './sections/EditDetailsSection';
import EditGoalSection from './sections/EditGoalSection';
import EditRemindersSection from './sections/EditRemindersSection';

export default function AddHabitScreen() {
	const { addHabit } = useHabits();
	const [builderErrors, setBuilderErrors] = useState([]);

	const habitBuilder = useMemo(() => {
		const hb = new HabitBuilder();
		hb.setErrors = (newErrors) => setBuilderErrors(newErrors);
		return hb;
	}, []);

	const buttonVariant = useMemo(() => (
		builderErrors.length > 0 ? INPUT_VARIANTS.DISABLED : INPUT_VARIANTS.PRIME
	), [builderErrors]);

	const handleAdd = async () => {
		try {
			let habit = habitBuilder.build();

			if (buttonVariant !== INPUT_VARIANTS.DISABLED) {
				habit = await addHabit(habit);
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

				onPress={handleAdd}
				style={{ marginTop: metrics.spacing.md, alignSelf: 'center' }}
			/>
		</ScreenContainer>
	);
}
