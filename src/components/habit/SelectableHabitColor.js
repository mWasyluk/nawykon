import BackgroundGradient from '@components/effects/BackgroundGradient';
import { colors, metrics, uiStyles } from '@styles';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function SelectableHabitColor(props) {
    const {
        color = undefined,
        isSelected = false,
        onPress = () => { },
    } = props;

    const colorStyle = [
        styles.container,
        { backgroundColor: color }
    ]

    const selectorStyle = [
        styles.selector,
        { borderWidth: isSelected ? metrics.buttonSize.sm / 4 : 0 },
        { borderColor: color ? colors.getContrastFor(color) : colors.primBlue }
    ]

    return (
        <TouchableOpacity onPress={onPress} style={colorStyle} >
            <BackgroundGradient />
            {isSelected && (
                <View style={selectorStyle} />
            )}
        </TouchableOpacity >
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: metrics.buttonSize.sm,
        height: metrics.buttonSize.sm,
        borderRadius: metrics.borderRadius.circular,
        ...uiStyles.lightShadow,
    },
    selector: {
        borderRadius: metrics.borderRadius.circular,
    }
});
