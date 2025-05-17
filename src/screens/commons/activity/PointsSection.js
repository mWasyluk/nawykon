import ActivityValueIcon from '@components/activity/ActivityValueIcon';
import { BarChart } from '@components/charts/BarChart';
import { SectionContainer, SectionHeader, TabToggle } from '@components/layout';
import { useActivity } from '@contexts/ActivitiesContext';
import { colors, icons, metrics, uiStyles } from '@styles';
import { ActivityUtil } from '@utils/activityUtil';
import { validateTimestamp } from '@utils/dateUtil';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

const todaysDate = new Date();
const dateWeekAgo = new Date(new Date().setDate(todaysDate.getDate() - 7));
const dateMonthAgo = new Date(new Date().setDate(todaysDate.getDate() - 30));

export default function PointsSection({ habitId = undefined }) {
    const { activityRegistry } = useActivity();

    const totalPoints = ActivityUtil.calculateHabitPoints(activityRegistry.getRecords(), habitId);

    const recordsWeek = activityRegistry.getRecords(dateWeekAgo);
    const recordsMonth = activityRegistry.getRecords(dateMonthAgo);

    const tabs = [
        { name: '7 dni', getStatistics: () => ActivityUtil.calculateHabitStatistics(recordsWeek, habitId) },
        { name: '30 dni', getStatistics: () => ActivityUtil.calculateHabitStatistics(recordsMonth, habitId) },
    ];

    const [currentTabIndex, setCurrentTabIndex] = useState(0);

    const currentTab = tabs[currentTabIndex];
    const tabName = currentTab.name;
    const tabStatistics = currentTab.getStatistics();
    const { points, calendar } = tabStatistics;

    const pointsValue = points > 0 ? `+${points}` : points;
    const calendarEntries = Object.entries(calendar);

    const chartData = [];
    calendarEntries.reduce((sum, [date, stats]) => {
        chartData.push({ x: validateTimestamp(date).getDate(), y: sum += stats.points });
        return sum;
    }, 0);

    const toggleTab = () => {
        const nextIndex = (currentTabIndex + 1) % tabs.length;
        setCurrentTabIndex(nextIndex);
    };

    return (
        <SectionContainer>
            <SectionHeader
                title={'Punkty'}
                right={<ActivityValueIcon value={totalPoints} icon={icons.point} />}
            />
            <View style={styles.chartContainer}>
                <View style={styles.chartHeader}>
                    <TabToggle name={tabName} onPress={toggleTab} style={{ backgroundColor: colors.light }} />
                    <ActivityValueIcon value={pointsValue} icon={icons.point} />
                </View>
                <BarChart height={150} data={chartData} />
            </View>
        </SectionContainer>
    );
}

const styles = StyleSheet.create({
    chartContainer: {
        alignItems: 'center',
        padding: metrics.spacing.sm,
        borderRadius: metrics.borderRadius.sm,
        backgroundColor: colors.modalBackground,
        ...uiStyles.lightShadow,
    },
    chartHeader: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: metrics.spacing.sm,
    },
});
