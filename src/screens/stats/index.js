import ActivitySection from '@screens/commons/activity/ActivitySection';
import PointsSection from '@screens/commons/activity/PointsSection';
import ActionsSection from './sections/ActionsSection';
import { ScreenContainer } from '@components/layout';

export default function StatisticsScreen() {
    return (
        <ScreenContainer>
            <ActivitySection />
            <PointsSection />
            <ActionsSection />
        </ScreenContainer>
    );
}
