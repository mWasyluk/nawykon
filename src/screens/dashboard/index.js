import { ScrollView } from 'react-native';
import CalendarBarSection from './sections/CalendarBarSection';
import HabitsListSection from './sections/HabitsListSection';
import HeroBannerSection from './sections/HeroBannerSection';
import StatisticsChartSection from './sections/StatisticsChartSection';

export default function DashboardScreen() {
    return (
        <ScrollView>
            <CalendarBarSection />
            <HeroBannerSection />
            <StatisticsChartSection />
            <HabitsListSection />
        </ScrollView>
    );
}
