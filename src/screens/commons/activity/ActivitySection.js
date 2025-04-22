import ActivityValueIcon from "@components/activity/ActivityValueIcon";
import { SectionContainer, SectionHeader, TabToggle } from "@components/layout";
import { useStateManager } from "@contexts/StateManagerContext";
import { icons } from "@styles";
import { ActivityUtil } from "@utils/activityUtil";
import { formatDate, getMonthName } from "@utils/dateUtil";
import { useMemo, useState } from "react";
import DailyActivitySubsection from "./DailyActivitySubsection";
import StatusCalendarSubsection from "./StatusCalendarSubsection";

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

const firstDateCurrentMonth = new Date(currentYear, currentMonth, 1);
const lastDateCurrentMonth = new Date(currentYear, currentMonth + 1, 0);
const currentMonthName = getMonthName(firstDateCurrentMonth);

const firstDateOneMonthAgo = new Date(currentYear, currentMonth - 1, 1);
const lastDateOneMonthAgo = new Date(currentYear, currentMonth, 0);
const oneMonthAgoName = getMonthName(firstDateOneMonthAgo);

const firstDateTwoMonthsAgo = new Date(currentYear, currentMonth - 2, 1);
const lastDateTwoMonthsAgo = new Date(currentYear, currentMonth - 1, 0);
const twoMonthsAgoName = getMonthName(firstDateTwoMonthsAgo);

const getStatistics = (registry, habitId, startDate, endDate) => {
    const records = registry.getRecords(startDate, endDate);
    return ActivityUtil.calculateHabitStatistics(records, habitId);
}

export default function ActivitySection(props) {
    const { habitId = undefined } = props;
    const { activityRegistry } = useStateManager();

    const [selectedDate, setSelectedDate] = useState(formatDate(today, 'date'));

    const tabs = [
        { name: currentMonthName, getStatistics: () => getStatistics(activityRegistry, habitId, firstDateCurrentMonth, lastDateCurrentMonth) },
        { name: oneMonthAgoName, getStatistics: () => getStatistics(activityRegistry, habitId, firstDateOneMonthAgo, lastDateOneMonthAgo) },
        { name: twoMonthsAgoName, getStatistics: () => getStatistics(activityRegistry, habitId, firstDateTwoMonthsAgo, lastDateTwoMonthsAgo) },
    ]

    const [selectedTabIndex, setSelectedTabIndex] = useState(0);
    const selectedTab = tabs[selectedTabIndex];

    const toggleTab = () => {
        setSelectedTabIndex((selectedTabIndex + 1) % tabs.length);
    }

    const monthlyStatistics = useMemo(() => (
        selectedTab.getStatistics()
    ), [selectedTab, activityRegistry, habitId]);

    const dailyStatistics = useMemo(() => (
        monthlyStatistics.calendar[selectedDate]
    ), [selectedDate, activityRegistry]);

    const dailyMoodReport = useMemo(() => (
        activityRegistry.getRecord(selectedDate).mood
    ), [selectedDate, activityRegistry]);

    const onSelectDate = (date) => {
        setSelectedDate(date);
    };

    return (
        <SectionContainer style={{ alignItems: 'center' }}>
            <SectionHeader title="Aktywność"
                badge={<TabToggle name={selectedTab.name} onPress={toggleTab} />}
                right={<ActivityValueIcon value={monthlyStatistics.streak} icon={icons.streak} />}
            />

            <StatusCalendarSubsection
                data={monthlyStatistics.calendar}
                onSelectDate={onSelectDate}
                selectedDate={selectedDate}
                completed={monthlyStatistics.completed}
                failed={monthlyStatistics.failed}
                partial={monthlyStatistics.partial}
            />

            <DailyActivitySubsection
                date={selectedDate}
                moodReport={dailyMoodReport}
                habitStatistics={dailyStatistics}
                habitId={habitId}
            />
        </SectionContainer>
    );
}
