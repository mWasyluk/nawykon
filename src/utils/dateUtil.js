export const validateTimestamp = (timestamp) => {
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
        // return date.toLocaleString('sv', type === 'date' ? dateOptions : type === 'time' ? timeOptions : datetimeOptions);
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
