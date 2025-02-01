import { colors } from '@styles';
import { STATISTIC_STATUSES } from "@models/reports/HabitReportStatistics";
import { TouchableOpacity, View } from 'react-native';

export default function PlanStatusRecord(props) {
    const {
        status = undefined,
        date = undefined,
        isSelected = false,
        width = 30,
        height = 25,
        pointRate = 0.5,
        onPress = () => { },
    } = props;

    const pointDiameter = Math.min(width, height) * pointRate;

    const pointColor = status === STATISTIC_STATUSES.completed ? colors.lightSuccess
        : status === STATISTIC_STATUSES.failed ? colors.lightError
            : status === STATISTIC_STATUSES.partial ? colors.lightWarning
                : status === STATISTIC_STATUSES.neutral ? colors.light
                    : status === 'current' ? colors.primBlue
                        : colors.midGray;

    const pointStyle = {
        backgroundColor: pointColor,
        width: pointDiameter,
        height: pointDiameter,
        borderRadius: 100,
    };

    const containerStyle = {
        alignItems: 'center',
        justifyContent: 'center',
        width: width,
        height: height,
        borderRadius: 10,
        borderColor: colors.primBlue,
        borderWidth: isSelected ? 2 : 0,
    }

    return (
        <TouchableOpacity style={containerStyle} onPress={() => onPress(date)}>
            <View style={pointStyle} />
        </TouchableOpacity>
    );
};
