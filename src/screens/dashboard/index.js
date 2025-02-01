import { ScrollView } from 'react-native';
import CalendarBarSection from './sections/CalendarBarSection';
import DateSettingsSection from './sections/DateSettingsSection';
import HabitsListSection from './sections/HabitsListSection';
import StatisticsChartSection from './sections/StatisticsChartSection';

export default function DashboardScreen() {
    return (
        <ScrollView>
            <DateSettingsSection />
            <CalendarBarSection />
            <StatisticsChartSection />
            <HabitsListSection />
        </ScrollView>
    );
}
