import ActivityValueIcon from "@components/activity/ActivityValueIcon";
import { SectionContainer, SectionHeader, TabToggle } from "@components/layout";
import { useActivity } from "@contexts/ActivitiesContext";
import { icons } from "@styles";
import { ActivityUtil } from "@utils/activityUtil";
import { formatDate, getMonthName, validateTimestamp } from "@utils/dateUtil";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import DailyActivitySubsection from "./DailyActivitySubsection";
import StatusCalendarSubsection from "./StatusCalendarSubsection";
import { useHabits } from "@contexts/HabitsContext";

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
    const { habits } = useHabits();
    const { activityRegistry } = useActivity();
    const { date: targetDate } = useLocalSearchParams();

    const targetHabit = useMemo(() => {
        return habits.find((habit) => habit.id === habitId);
    }, [habits, habitId]);

    const streak = useMemo(() => {
        if (targetHabit) {
            return targetHabit.streak;
        }

        return ActivityUtil.calculateAllHabitsStreak(activityRegistry);
    }, [targetHabit, activityRegistry]);

    const validatedTargetDate = useMemo(() => {
        try {
            const validatedParamDate = validateTimestamp(targetDate);
            if (!validatedParamDate || validatedParamDate > today || validatedParamDate < firstDateTwoMonthsAgo) {
                return today;
            }
            return validatedParamDate;
        } catch (error) {
            return today;
        }
    }, [targetDate]);
    const [selectedDate, setSelectedDate] = useState(formatDate(validatedTargetDate, 'date'));

    const tabs = [
        { name: currentMonthName, getStatistics: () => getStatistics(activityRegistry, habitId, firstDateCurrentMonth, lastDateCurrentMonth) },
        { name: oneMonthAgoName, getStatistics: () => getStatistics(activityRegistry, habitId, firstDateOneMonthAgo, lastDateOneMonthAgo) },
        { name: twoMonthsAgoName, getStatistics: () => getStatistics(activityRegistry, habitId, firstDateTwoMonthsAgo, lastDateTwoMonthsAgo) },
    ]

    const targetTabIndex = useMemo(() => {
        if (validatedTargetDate >= firstDateCurrentMonth) return 0;
        if (validatedTargetDate >= firstDateOneMonthAgo) return 1;
        return 2;
    }, [validatedTargetDate]);
    const [selectedTabIndex, setSelectedTabIndex] = useState(targetTabIndex);
    const selectedTab = tabs[selectedTabIndex];

    const toggleTab = () => {
        setSelectedTabIndex((selectedTabIndex + 1) % tabs.length);
    }

    const monthlyStatistics = useMemo(() => {
        const stats = selectedTab.getStatistics();
        // Do not update calendar records with isReport flags if the activity section is destined for a single habit
        if (!habitId) {
            const updatedCalendar = Object.entries(stats.calendar).reduce((acc, [date, record]) => {
                acc[date] = {
                    ...record,
                    isReport: !!activityRegistry.records[date]?.mood,
                };
                return acc;
            }, {});

            stats.calendar = updatedCalendar;
        }
        return stats;
    }, [selectedTab, activityRegistry, habitId]);

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
                right={<ActivityValueIcon value={streak} icon={icons.streak} />}
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
