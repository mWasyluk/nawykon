import { fullMonths } from "@data/time";

export const validateTimestamp = (timestamp) => {
    if (!timestamp) {
        throw new Error('Timestamp is empty');
    }

    if (timestamp instanceof Date) {
        return timestamp;
    }

    const date = new Date(timestamp);

    if (isNaN(date.getTime())) {
        throw new Error(`${timestamp} is not a valid timestamp format`);
    }
    return date;
};

export const formatDate = (date, type = 'date') => {
    if (!date) {
        throw new Error('Date is required');
    }
    const validDate = validateTimestamp(date);

    const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const shortTimeOptions = { hour: '2-digit', minute: '2-digit' };
    const timeOptions = { ...shortTimeOptions, second: '2-digit' };
    const datetimeOptions = { ...dateOptions, ...timeOptions };

    try {
        switch (type) {
            case 'date':
                return validDate.toLocaleDateString('sv', dateOptions); // 2021-01-01
            case 'time':
                return validDate.toLocaleTimeString('sv', timeOptions); // 00:00:00
            case 'shorttime':
                return validDate.toLocaleTimeString('sv', shortTimeOptions); // 00:00
            case 'datetime':
                return validDate.toLocaleString('sv', datetimeOptions); // 2021-01-01 00:00:00
        }
    } catch (error) {
        throw new Error(`${date} is invalid date format`);
    }
}

// Handles monday as the first day of week
export const getFixedDayOfWeek = (date) => {
    const validDate = validateTimestamp(date);

    return (validDate.getDay() + 6) % 7;
};

export const getMonthLength = (date) => {
    const validDate = validateTimestamp(date);

    return new Date(validDate.getFullYear(), validDate.getMonth() + 1, 0).getDate();
}

export const getMonthName = (date, monthsArray = fullMonths) => {
    const validDate = validateTimestamp(date);

    return monthsArray[validDate.getMonth()];
}
