import ScreenSection from "@components/containers/ScreenSection";
import TextOptionPicker from "@components/ui/TextOptionPicker";
import { useMemo, useState } from "react";
import { ActivityCalendarView } from "./ActivityCalendarView";
import { ActivityProgressView } from "./ActivityProgressView";
import { useStateManager } from "src/context/StateManagerContext";

export const ActivitySection = (props) => {
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
