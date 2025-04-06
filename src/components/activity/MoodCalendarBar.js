import MoodCalendarPage from '@components/activity/MoodCalendarPage';
import { useStateManager } from '@contexts/StateManagerContext';
import { metrics } from '@styles';
import { StyleSheet, View } from 'react-native';

export default function MoodCalendarBar() {
    const { activityRegistry } = useStateManager();

    const pages = [];
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const day = date.getDate();
        const month = date.getMonth();

        const { mood } = activityRegistry.getRecord(date);
        const humor = mood?.humor;
        const isNote = !!mood?.note;

        pages.push(
            <MoodCalendarPage
                key={`calendar-page-${i}`}
                day={day}
                month={month}
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
