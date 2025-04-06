import { ScreenContainer } from '@components/layout';
import CalendarBarSection from './sections/CalendarBarSection';
import HabitsListSection from './sections/HabitsListSection';
import HeroBannerSection from './sections/HeroBannerSection';
import StatisticsChartSection from './sections/StatisticsChartSection';

export default function DashboardScreen() {
    return (
        <ScreenContainer>
            <CalendarBarSection />
            <HeroBannerSection />
            <StatisticsChartSection />
            <HabitsListSection />
        </ScreenContainer>
    );
}
