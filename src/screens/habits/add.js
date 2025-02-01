import Button from '@components/ui/Button';
import routes from '@data/router';
import { icons } from '@styles';
import { ScrollView } from 'react-native';
import HabitDetailsSection from './sections/add/HabitDetailsSection';
import HabitGoalSection from './sections/add/HabitGoalSection';
import HabitReminderSection from './sections/add/HabitReminderSection';
import PickHabitSection from './sections/add/PickHabitSection';
import { useHabits } from 'src/context/HabitsContext';
import { useUser } from 'src/context/UserContext';
import { useState, useCallback, useEffect } from 'react';
import { Habit } from '@models/habit/Habit';

export default function AddHabitScreen() {
	const { user } = useUser();
	const { addHabit } = useHabits();

	const [habit, setHabit] = useState({ userId: user.id });
	const [isSaveReady, setIsSaveReady] = useState(false);

	const handleTypeChange = useCallback((type) => {
		setHabit(prev => ({ ...prev, details: { ...prev.details, type } }));
	}, []);

	const handleDetailsChange = useCallback((details) => {
		setHabit(prev => ({ ...prev, details: { ...prev.details, ...details } }));
	}, []);

	const handleGoalChange = useCallback((goal) => {
		setHabit(prev => ({ ...prev, goal }));
	}, []);

	const handleRemindersChange = useCallback((reminders) => {
		setHabit(prev => ({ ...prev, reminders }));
	}, []);

	const handleHabitSave = () => {
		addHabit(new Habit(habit));
	}

	useEffect(() => {
		const verifyHabit = () => {
			try {
				new Habit(habit);
				setIsSaveReady(true);
			} catch (err) {
				setIsSaveReady(false);
			}
		}

		verifyHabit();
	}, [habit]);

	return (
		<ScrollView contentContainerStyle={{ alignItems: 'center' }}>
			<PickHabitSection onChange={handleTypeChange} />
			<HabitDetailsSection onChange={handleDetailsChange} />
			<HabitGoalSection onChange={handleGoalChange} />
			<HabitReminderSection onChange={handleRemindersChange} />
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
