import PlanStatusRecord from '@components/activity/PlanStatusRecord';
import { colors } from '@styles';
import { formatDate, getFixedDayOfWeek, getMonthLength } from '@utils/dateUtil';
import { StyleSheet, View } from 'react-native';

const MIN_CALENDAR_ROWS = 5;

export default function PlanStatusCalendar(props) {
    const {
        dailyStats = {},
        selectedDate = formatDate(new Date(), date),

        setSelectedDate = () => { },
    } = props;

    const recordWidth = 30;
    const recordHeight = 25;

    const sortedDates = Object.keys(dailyStats).sort((a, b) => new Date(a) - new Date(b));

    if (sortedDates.length === 0) {
        return null;
    }

    const firstGivenDate = new Date(sortedDates[0]);
    const firstDayOfWeek = getFixedDayOfWeek(formatDate(firstGivenDate).slice(0, 7));
    const monthLength = getMonthLength(sortedDates[0]);

    const minRows = Math.ceil((monthLength + firstDayOfWeek) / 7);
    const rows = Math.max(minRows, MIN_CALENDAR_ROWS);

    const allRecordsAmount = 7 * rows;
    const allRecords = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
        allRecords.push(undefined);
    }

    for (let i = 0; i < sortedDates.length; i++) {
        allRecords.push({ ...dailyStats[sortedDates[i]], date: sortedDates[i] });
    }

    for (let i = allRecords.length; i < allRecordsAmount; i++) {
        allRecords.push(undefined);
    }

    const handleDaySelection = (val) => {
        const statsForDate = dailyStats[val];
        if (!statsForDate) {
            return;
        }
        setSelectedDate(val);
    }

    const containerStyle = [
        styles.container,
        {
            width: recordWidth * 7,
            height: recordHeight * rows,
        }
    ]

    return (
        <View style={containerStyle}>
            {allRecords.map((record, index) => (
                <PlanStatusRecord
                    key={index}
                    status={record?.status}
                    date={record?.date}
                    isSelected={record?.date === selectedDate}
                    onPress={handleDaySelection}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 0,
        flexWrap: 'wrap',
        backgroundColor: colors.lightGray,
        borderRadius: 10,
    },
});
