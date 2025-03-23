import { CaptionText } from '@components/text';
import { shortDays } from '@constants/time';
import { colors, metrics } from '@styles';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const POINT_SIZE = 12;
const SELECTION_RING_WIDTH = 2;
const SELECTION_RING_PADDING = 4;
const MIN_WIDTH = 20;
const MIN_HEIGHT = 20;

export const CALENDAR_RECORD_VARIANTS = {
    DISABLED: 'DISABLED',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
    PARTIAL: 'PARTIAL',
    CURRENT: 'CURRENT',
    UNDEFINED: 'UNDEFINED',
    WEEKDAY: 'WEEKDAY',
}

export default function StatusCalendarRecord(props) {
    const {
        variant = CALENDAR_RECORD_VARIANTS.UNDEFINED,
        weekday = 0,
        isSelected = false,
        onPress = () => { },
        style = {},
    } = props;


    let pointColor;
    switch (variant) {
        case CALENDAR_RECORD_VARIANTS.DISABLED:
            pointColor = colors.light;
            break;
        case CALENDAR_RECORD_VARIANTS.COMPLETED:
            pointColor = colors.lightSuccess;
            break;
        case CALENDAR_RECORD_VARIANTS.FAILED:
            pointColor = colors.lightError;
            break;
        case CALENDAR_RECORD_VARIANTS.PARTIAL:
            pointColor = colors.lightWarning;
            break;
        case CALENDAR_RECORD_VARIANTS.CURRENT:
            pointColor = colors.primBlue;
            break;
        default:
            pointColor = colors.lightGray;
            break;
    }

    return (
        <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
            {variant === CALENDAR_RECORD_VARIANTS.WEEKDAY
                ? <CaptionText style={styles.weekday}>{shortDays[weekday].charAt(0)}</CaptionText>
                : <>
                    {isSelected && <View style={styles.selection} />}
                    <View style={[styles.point, { backgroundColor: pointColor }]} />
                </>}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: MIN_WIDTH,
        minHeight: MIN_HEIGHT,
    },
    weekday: {
        color: colors.darkGray,
    },
    point: {
        width: POINT_SIZE,
        height: POINT_SIZE,
        borderRadius: metrics.borderRadius.sm,
    },
    selection: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: POINT_SIZE + SELECTION_RING_PADDING * 2,
        height: POINT_SIZE + SELECTION_RING_PADDING * 2,
        borderRadius: '100%',
        borderWidth: SELECTION_RING_WIDTH,
        borderColor: colors.primBlue,
    },
});
