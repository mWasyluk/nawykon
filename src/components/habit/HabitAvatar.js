import BackgroundGradient from '@components/effects/BackgroundGradient';
import { types as habitTypes } from '@constants/habit';
import { colors, metrics } from '@styles';
import { Image, StyleSheet, View } from 'react-native';

const DEFAULT_AVATAR_SIZE = 48;
const ICON_SIZE_RATE = 0.55;
const DEFAULT_BG_COLOR = colors.light;
const DEFAULT_ICON_COLOR = colors.midGray;

export default function HabitAvatar(props) {
    const {
        type,
        color,
        style = {},
    } = props;

    const habitType = habitTypes[type];

    const adjSize = Math.min(style.height || DEFAULT_AVATAR_SIZE, style.width || DEFAULT_AVATAR_SIZE);
    const iconSize = adjSize * ICON_SIZE_RATE;

    const backgroundColor = color || DEFAULT_BG_COLOR;
    const iconColor = color ? colors.getContrastFor(color) : DEFAULT_ICON_COLOR;

    return (
        <View style={[styles.habitIconContainer, { backgroundColor }, style]}>
            <BackgroundGradient />
            <Image source={habitType.icon}
                style={{ height: iconSize, width: iconSize }}
                tintColor={iconColor} />
        </View>
    );
}

const styles = StyleSheet.create({
    habitIconContainer: {
        width: DEFAULT_AVATAR_SIZE,
        height: DEFAULT_AVATAR_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: metrics.borderRadius.circular,
    }
});
