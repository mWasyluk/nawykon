import React from 'react';
import { StyleSheet } from 'react-native';
import CalendarPage from '@components/calendar/CalendarPage';
import CalendarPageActive from '@components/calendar/CalendarPageActive';
import ScreenSection from '@components/containers/ScreenSection';

export default function CalendarBarSection() {
    const days = [];
    for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const day = date.getDate();
        const monthShort = date.toLocaleString('default', { month: 'short' });
        if (i === 0) {
            days.push(<CalendarPageActive key={i} day={day} month={monthShort} />);
        } else {
            days.push(<CalendarPage key={i} day={day} month={monthShort} />);
        }
    }

    return (
        <ScreenSection containerStyle={styles.container}>
            {days}
        </ScreenSection>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
