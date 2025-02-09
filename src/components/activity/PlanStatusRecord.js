import { Statistics } from '@models/reports/Statistics';
import { colors } from '@styles';
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

    const pointColor = status === Statistics.STATUSES.completed ? colors.lightSuccess
        : status === Statistics.STATUSES.failed ? colors.lightError
            : status === Statistics.STATUSES.partial ? colors.lightWarning
                : status === Statistics.STATUSES.neutral ? colors.light
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
