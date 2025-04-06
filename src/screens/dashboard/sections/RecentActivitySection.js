import HeroBanner from "@components/activity/HeroBanner";
import MoodCalendarBar from "@components/activity/MoodCalendarBar";
import { SectionContainer, SectionHeader } from "@components/layout"

export default function RecentActivitySection() {
    return (
        <SectionContainer>
            <SectionHeader title="Ostatnia aktywność" />
            <MoodCalendarBar />
            <HeroBanner />
        </SectionContainer>
    );
}
