import PlanStatusRecord from '@components/activity/PlanStatusRecord';
import { colors } from '@styles';
import { formatDate, validateTimestamp } from '@utils/dateUtil';
import { StyleSheet, View } from 'react-native';

export default function PlanStatusCalendar(props) {
    const {
        records = [],
        firstDayOfWeek = 0,
        isLastDayCurrent = false,
        selectedDate = new Date(),
        dynamicRows = false,
        onDaySelect = () => { },
    } = props;

    const recordWidth = 30;
    const recordHeight = 25;
    const dynamicMinRows = Math.ceil(records.length + firstDayOfWeek / 7);
    const finalRows = dynamicRows && dynamicMinRows < 6 ? 5 : 6;

    const containerStyle = [
        styles.container,
        {
            width: recordWidth * 7,
            height: recordHeight * finalRows,
        }
    ]

    const allRecordsAmount = 7 * finalRows;

    const allRecords = [
    ];

    for (let i = 0; i < firstDayOfWeek; i++) {
        allRecords.push(undefined);
    }

    for (let i = 0; i < records.length - 1; i++) {
        allRecords.push(records[i]);
    }

    if (isLastDayCurrent) {
        allRecords.push('current');
    }

    for (let i = allRecords.length; i < allRecordsAmount; i++) {
        allRecords.push(undefined);
    }

    const handleDaySelection = (val) => {
        var date = new Date();
        try {
            date = validateTimestamp(val);
        } catch (error) {
            console.warn(error);
        }
        onDaySelect(date);
    }

    return (
        <View style={containerStyle}>
            {allRecords.map((record, index) => (
                <PlanStatusRecord
                    key={index}
                    status={record?.status}
                    date={record?.date}
                    isSelected={record?.date === formatDate(selectedDate)}
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
