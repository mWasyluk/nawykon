import InputContainer, { INPUT_SIZES, INPUT_VARIANTS } from '@components/input/InputContainer';
import { BodyBoldText, CaptionText } from '@components/text';
import routes from '@constants/router';
import { genitiveMonths } from '@constants/time';
import { colors, icons, metrics } from '@styles';
import { router } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';

const todaysDate = new Date();
const todaysDay = todaysDate.getDate();
const todaysMonth = todaysDate.getMonth();

export default function MoodCalendarPage(props) {
    const {
        day = todaysDay,
        month = todaysMonth,
        humor = undefined,
        isNote = true,
    } = props;

    // Date
    const monthName = genitiveMonths[month].slice(0, 3);
    const isToday = (day === todaysDay && month === todaysMonth);
    const variant = isToday ? INPUT_VARIANTS.PRIME : INPUT_VARIANTS.DEFAULT;
    const dayColor = isToday ? colors.light : colors.darkGray;
    const monthColor = isToday ? colors.lightGray : colors.midGray;

    // Mood report
    const isMoodInteger = Number.isInteger(humor);
    const moodIcon = icons[`mood${isMoodInteger ? humor : ''}`];
    const moodIconStyle = [
        styles.icon,
        !isMoodInteger && {
            filter: 'grayscale(100%)'
        },
    ]
    const noteColor = isToday ? colors.lightGray : colors.midGray;

    const onPress = () => {
        // TODO: override after implementing mood report edit for any date
        if (!isToday) {
            return;
        }
        router.navigate(routes.newMood);
    }

    return (
        <InputContainer variant={variant} size={INPUT_SIZES.AUTO} style={styles.container} onPress={onPress}>
            <BodyBoldText style={[styles.day, { color: dayColor }]}>{day}</BodyBoldText>
            <CaptionText style={[styles.month, { color: monthColor }]}>{monthName}</CaptionText>
            <View style={styles.iconsContainer}>
                <Image source={moodIcon} style={moodIconStyle} />
                {isNote && (
                    <Image source={icons.doc} style={styles.icon} tintColor={noteColor} />
                )}
            </View>
        </InputContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingVertical: metrics.spacing.xs,

        borderRadius: metrics.borderRadius.sm,
    },
    day: {
        marginBottom: -10,
    },
    month: {
        textTransform: 'uppercase',
        marginBottom: -5,
    },
    progress: {
        width: '100%',
        textAlign: 'center',
        borderRadius: metrics.borderRadius.circular,
    },
    iconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: metrics.imageSize.xs,
        height: metrics.imageSize.xs,
    }
});
