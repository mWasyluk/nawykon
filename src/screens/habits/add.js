import Button from '@components/ui/Button';
import routes from '@data/router';
import { HabitBuilder } from '@models/habit/Habit';
import { icons } from '@styles';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import { useModal } from 'src/context/ModalContext';
import { useHabits } from 'src/context/HabitsContext';
import HabitDetailsSection from './sections/add/HabitDetailsSection';
import HabitGoalSection from './sections/add/HabitGoalSection';
import HabitReminderSection from './sections/add/HabitReminderSection';
import PickHabitSection from './sections/add/PickHabitSection';

export default function AddHabitScreen() {

	const { addHabit } = useHabits();
	const { showError } = useModal();
	const [builderErrors, setBuilderErrors] = useState([]);

	const habitBuilder = useMemo(() => {
		const hb = new HabitBuilder();
		hb.setErrors = (newErrors) => setBuilderErrors(newErrors);
		return hb;
	}, []);

	const handleHabitSave = () => {
		try {
			addHabit(habitBuilder.build());
			router.push(routes.dashboard);
		} catch (error) {
			showError(error.message);
		}
	}

	return (
		<ScrollView contentContainerStyle={{ alignItems: 'center' }}>
			<PickHabitSection habitBuilder={habitBuilder} />
			<HabitDetailsSection habitBuilder={habitBuilder} />
			<HabitGoalSection habitBuilder={habitBuilder} />
			<HabitReminderSection habitBuilder={habitBuilder} />
			<Button
				title={"Zapisz"}
				icon={icons.check}
				onPress={handleHabitSave}
				// href={routes.dashboard}
				style={{ marginVertical: 20 }}
				disabled={builderErrors.length > 0}
			/>
		</ScrollView>
	);
}
