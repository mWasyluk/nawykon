import { CaptionText, BodyBoldText } from '@components/text';
import routes from '@constants/router';
import { useReports } from '@contexts/ReportsContext';
import { colors, icons } from '@styles';
import { router } from 'expo-router';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function CalendarPageActive(props) {
    const {
        day = 99,
        month = 'NAN',
    } = props;

    const { todaysReport } = useReports();
    const moodReport = todaysReport?.mood || {};

    var moodIcon = icons.mood;

    if (moodReport.humor) {
        moodIcon = icons[`mood${moodReport.humor}`];
    }

    return (
        <TouchableOpacity style={styles.container} onPress={() => router.push(routes.newMood)}>
            <View style={styles.textContainer}>
                <BodyBoldText style={styles.day}>{day}</BodyBoldText>
                <CaptionText style={styles.month}>{month}</CaptionText>
            </View>
            <Image source={moodIcon} style={{ width: 32, height: 32, filter: !moodReport?.humor ? 'grayscale(100%)' : undefined }} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 48,
        flex: 1.5,
        backgroundColor: colors.primBlue,
        borderRadius: 8,
        padding: 10,
        gap: 5
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    day: {
        color: colors.light,
    },
    month: {
        textTransform: 'uppercase',
        color: colors.light,
    },
});
