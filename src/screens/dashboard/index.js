import { ScreenContainer } from '@components/layout';
import HabitsListSection from './sections/HabitsListSection';
import RecentActivitySection from './sections/RecentActivitySection';
import StatisticsChartSection from './sections/StatisticsChartSection';

export default function DashboardScreen() {
    return (
        <ScreenContainer>
            <RecentActivitySection />
            <StatisticsChartSection />
            <HabitsListSection />
        </ScreenContainer>
    );
}
