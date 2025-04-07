import { ScreenContainer } from '@components/layout';
import HabitsListSection from './sections/HabitsListSection';
import RecentActivitySection from './sections/RecentActivitySection';
import StatisticsBriefSection from './sections/StatisticsBriefSection';

export default function DashboardScreen() {
    return (
        <ScreenContainer>
            <RecentActivitySection />
            <StatisticsBriefSection />
            <HabitsListSection />
        </ScreenContainer>
    );
}
