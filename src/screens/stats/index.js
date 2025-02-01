import { exampleHabits } from '@data/test/exampleHabits';
import { Habit } from '@models/habit/Habit';
import { HabitReportStatistics } from '@models/reports/HabitReportStatistics';
import { generateActivityData, generateProgressData } from '@utils/statsUtil';
import PointsSection from './sections/PointsSection';
import { generateDailyPlanArray } from '@data/test/samples';
import { formatDate } from '@utils/dateUtil';
import { ScrollView } from 'react-native';
import ActivitySection from '../habits/sections/[id]/ActivitySection';
import ProgressSection from '../habits/sections/[id]/ProgressSection';

export default function Statistics() {
    const points = 165;

    const habits = exampleHabits.map((habit) => new Habit(habit));
    const habitsPlanArray = generateDailyPlanArray(habits[0], '2024-11-01', formatDate(new Date(), 'date'));

    const activityData = generateActivityData(habitsPlanArray.map((dailyPlan) => new HabitReportStatistics(dailyPlan)));
    const progressData = generateProgressData(habitsPlanArray.map((dailyPlan) => new HabitReportStatistics(dailyPlan)));

    return (
        <ScrollView>
            <PointsSection points={points} />
            <ActivitySection data={activityData} />
            <ProgressSection data={progressData} currentPoints={points} />
        </ScrollView>
    );
}
