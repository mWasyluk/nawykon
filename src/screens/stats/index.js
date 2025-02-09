import { ActivitySection } from '@components/sections/activity/ActivitySection';
import { ScrollView } from 'react-native';
import PointsSection from './sections/PointsSection';

export default function Statistics() {
    const points = 165;

    return (
        <ScrollView>
            <PointsSection points={points} />
            <ActivitySection />
        </ScrollView>
    );
}
