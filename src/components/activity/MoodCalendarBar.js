import MoodCalendarPage from '@components/activity/MoodCalendarPage';
import { useActivity } from '@contexts/ActivitiesContext';
import { metrics } from '@styles';
import { StyleSheet, View } from 'react-native';

export default function MoodCalendarBar() {
    const { activityRegistry } = useActivity();

    const pages = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();

        const { mood, habits } = activityRegistry.getRecord(date);
        var habitsEffectual, habitsGoal;
        if (habits) {
            habitsEffectual = Object.values(habits)
                .map(h => h.effectual)
                .reduce((sum, cur) => sum + cur, 0) || 0;
            habitsGoal = Object.values(habits)
                .map(h => h.goal)
                .reduce((sum, cur) => sum + cur, 0) || 0;
        }
        const humor = mood?.humor;
        const isNote = !!mood?.note;

        pages.push(
            <MoodCalendarPage
                key={`calendar-page-${i}`}
                day={day}
                month={month}
                year={year}
                completed={habitsEffectual}
                goal={habitsGoal}
                humor={humor}
                isNote={isNote}
            />
        );
    }

    return (
        <View style={styles.container}>
            {pages}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: metrics.spacing.sm,
    },
});
