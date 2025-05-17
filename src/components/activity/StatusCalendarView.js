import { colors, metrics, uiStyles } from "@styles";
import { ACTIVITY_STATUSES } from "@utils/activityUtil";
import { formatDate, getFixedDayOfWeek } from "@utils/dateUtil";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import StatusCalendarRecord, { CALENDAR_RECORD_VARIANTS } from "./StatusCalendarRecord";

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();
const currentDay = currentDate.getDate();

export const StatusCalendarView = (props) => {
    const {
        data = {},
        onSelectDate = () => { },
        selectedDate: defaultSelectedDate = null,
    } = props;

    const [selectedDate, setSelectedDate] = useState(defaultSelectedDate);

    const firstDateOfData = new Date(Object.keys(data)[0]);
    const dataYear = firstDateOfData.getFullYear();
    const dataMonth = firstDateOfData.getMonth();
    const firstDateOfDataMonth = new Date(dataYear, dataMonth, 1);
    const lastDateOfDataMonth = new Date(dataYear, dataMonth + 1, 0);

    const firstDayOfWeek = getFixedDayOfWeek(firstDateOfDataMonth);

    const calendarRecords = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
        calendarRecords.push({ variant: CALENDAR_RECORD_VARIANTS.DISABLED });
    }

    const isDataFromCurrentMonth = dataYear === currentYear && dataMonth === currentMonth;
    for (let i = 1; i <= lastDateOfDataMonth.getDate(); i++) {
        const date = formatDate(new Date(dataYear, dataMonth, i), 'date');
        if (isDataFromCurrentMonth && i === currentDay) {
            calendarRecords.push({
                date: formatDate(currentDate, 'date'),
                variant: CALENDAR_RECORD_VARIANTS.CURRENT
            });
            continue;
        }

        const dataRecord = data[date];
        if (dataRecord) {
            let variant;
            switch (dataRecord.status) {
                case ACTIVITY_STATUSES.COMPLETED:
                    variant = CALENDAR_RECORD_VARIANTS.COMPLETED;
                    break;
                case ACTIVITY_STATUSES.FAILED:
                    variant = CALENDAR_RECORD_VARIANTS.FAILED;
                    break;
                case ACTIVITY_STATUSES.PARTIAL:
                    variant = CALENDAR_RECORD_VARIANTS.PARTIAL;
                    break;
                default:
                    variant = CALENDAR_RECORD_VARIANTS.UNDEFINED;
                    break;
            }
            calendarRecords.push({ date, variant });
            continue;
        }

        calendarRecords.push({ date, variant: CALENDAR_RECORD_VARIANTS.UNDEFINED });
    }

    for (let i = 0; i < 42 - lastDateOfDataMonth.getDate() - firstDayOfWeek; i++) {
        calendarRecords.push({ variant: CALENDAR_RECORD_VARIANTS.DISABLED });
    }

    const onRecordSelect = (date) => {
        setSelectedDate(date);
        onSelectDate(date);
    };

    return (
        <View style={style.container}>
            {Array.from({ length: 7 }).map((_, index) => (
                <StatusCalendarRecord
                    key={index}
                    variant={CALENDAR_RECORD_VARIANTS.WEEKDAY}
                    weekday={index}
                    style={{ width: `${100 / 7}%` }}
                />
            ))}
            {calendarRecords.map(({ date, variant }, index) => {
                return (
                    <StatusCalendarRecord
                        key={index + 7}
                        variant={variant}
                        isSelected={selectedDate === date}
                        onPress={() => date && onRecordSelect(date)}
                        style={{ width: `${100 / 7}%` }}
                    />
                )
            })}
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: colors.modalBackground,
        borderRadius: metrics.borderRadius.sm,
        ...uiStyles.lightShadow,
    }
})
