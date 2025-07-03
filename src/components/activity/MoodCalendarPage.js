import InputContainer, { INPUT_SIZES, INPUT_VARIANTS } from '@components/input/InputContainer';
import { BodyBoldText, CaptionText } from '@components/text';
import routes from '@constants/router';
import { genitiveMonths } from '@constants/time';
import { colors, icons, metrics } from '@styles';
import { router } from 'expo-router';
import { Image, StyleSheet, View } from 'react-native';
import HabitProgressView, { PROGRESS_VIEW_SIZES } from './HabitProgressView';
import { formatDate } from '@utils/dateUtil';

const todaysDate = new Date();
const todaysDay = todaysDate.getDate();
const todaysMonth = todaysDate.getMonth();
const todaysYear = todaysDate.getFullYear();

export default function MoodCalendarPage(props) {
    const {
        day = todaysDay,
        month = todaysMonth,
        year = todaysYear,
        completed = 0,
        goal = 0,
        humor = undefined,
        isNote = true,
    } = props;

    // Date
    const weekDayName = new Date(year, month, day).toLocaleDateString('pl-PL', { weekday: 'long' }).slice(0, 3);
    const weekDayNameView = weekDayName.charAt(0).toUpperCase() + weekDayName.slice(1);
    const monthName = genitiveMonths[month].slice(0, 3);
    const monthNameView = monthName.toUpperCase();
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
        const targetDate = new Date(year, month, day);
        router.navigate({ pathname: routes.statistics, params: { date: formatDate(targetDate, 'date') } });
    }

    return (
        <InputContainer variant={variant} size={INPUT_SIZES.AUTO} style={styles.container} onPress={onPress}>
            <CaptionText style={{ color: monthColor }}>{weekDayNameView}</CaptionText>
            <BodyBoldText style={[styles.day, { color: dayColor }]}>{day}</BodyBoldText>
            <CaptionText style={{ color: monthColor, ...styles.dateLastLine }}>{monthNameView}</CaptionText>

            <HabitProgressView completed={completed} goal={goal} size={PROGRESS_VIEW_SIZES.SMALL} />
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
        marginVertical: -10,
    },
    dateLastLine: {
        marginBottom: -3,
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
