import { ActivityCalendarView } from "@components/activity/ActivityCalendarView";
import { ActivityProgressView } from "@components/activity/ActivityProgressView";
import TextOptionPicker from "@components/input/TextOptionPicker";
import ScreenSection from "@components/layout/ScreenSection";
import { useMemo, useState } from "react";
import { useStateManager } from "@contexts/StateManagerContext";

export default function ActivitySection(props) {
    const {
        habitId = undefined,
    } = props;

    const { statistics } = useStateManager();
    const monthlyStats = useMemo(() => statistics.getMonthlyStats(5, habitId), [statistics]);

    const monthNames = useMemo(() => Object.keys(monthlyStats), [statistics]);
    const [selectedMonth, setSelectedMonth] = useState(monthNames[monthNames.length - 1]);

    const monthData = monthlyStats[selectedMonth];

    return (
        <ScreenSection title="Aktywność" containerStyle={{ alignItems: 'center', gap: 10 }} >
            <TextOptionPicker
                options={monthNames}
                initIndex={monthNames.indexOf(selectedMonth)}
                loop={false}
                onOptionChange={setSelectedMonth}
            />
            <ActivityCalendarView
                monthStats={monthData}
            />
            <ActivityProgressView
                dailyStats={monthData.dailyStats}
            />
        </ScreenSection>
    );
}
