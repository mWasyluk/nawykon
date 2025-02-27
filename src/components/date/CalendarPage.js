import { CaptionText, BodyBoldText } from '@components/text';
import { colors } from '@styles';
import { StyleSheet, View } from 'react-native';

export default function CalendarPage(props) {
    const { day = 99, month = 'NAN' } = props;

    return (
        <View style={styles.container}>
            <BodyBoldText style={styles.day}>{day}</BodyBoldText>
            <CaptionText style={styles.month}>{month}</CaptionText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 48,
        flex: 1,
        borderWidth: 1,
        borderColor: colors.lightGray,
        borderRadius: 8,
    },
    day: {
        color: colors.darkGray,
    },
    month: {
        textTransform: 'uppercase',
        color: colors.midGray,
    },
});
