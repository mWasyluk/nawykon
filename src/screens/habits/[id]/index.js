import { HabitReportStatistics } from '@models/reports/HabitReportStatistics';
import { generateActivityData } from '@utils/statsUtil';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';
import { useHabits } from 'src/context/HabitsContext';
import { useReports } from 'src/context/ReportsContext';
import ActivitySection from '../sections/[id]/ActivitySection';
import HabitDetailsSection from '../sections/[id]/HabitDetailsSection';
import ProgressSection from '../sections/[id]/ProgressSection';

export default function HabitDetailsScreen() {
    const { id } = useLocalSearchParams();
    const { habits } = useHabits();
    const { habitReports } = useReports();

    const currentHabit = habits.find((habit) => habit.id === id);
    const currentHabitReportsArray = habitReports.filter((report) => report.habitId === id);

    return (
        <ScrollView>
            <HabitDetailsSection
                id={currentHabit.id}
                name={currentHabit.details.name}
                description={currentHabit.details.description}
                type={currentHabit.details.type}
            />
            <ActivitySection
                data={generateActivityData(currentHabitReportsArray.map((habitReport) => new HabitReportStatistics(habitReport)))}
            // data={generateActivityData(habitsPlanArray.map((habitReport) => new HabitReportStatistics(habitReport)))}
            />
            <ProgressSection
                data={[]}
                // data={generateProgressData(habitsPlanArray.map((dailyPlan) => new HabitReportStatistics(dailyPlan)))}
                currentPoints={145} />
        </ScrollView>
    );
}
