import BackgroundGradient from "@components/effects/BackgroundGradient";
import { colors, metrics, uiStyles } from "@styles";
import { TouchableOpacity, View } from "react-native";

export const BUTTON_COLORS = {
    DEFAULT: colors.modalBackground,
    ERROR: colors.lightError,
    PRIME: colors.primBlue,
    DISABLED: colors.lightGray,
}

export const BUTTON_SIZES = {
    DEFAULT: metrics.buttonSize.sm,
    LARGE: metrics.buttonSize.lg,
}

export default function ButtonContainer(props) {
    const {
        children,
        color = BUTTON_COLORS.DEFAULT,
        size = BUTTON_SIZES.DEFAULT,
        style = {},
        onPress = () => { },
    } = props;

    const buttonStyles = [
        {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',

            height: size,
            paddingHorizontal: size === BUTTON_SIZES.LARGE ? metrics.spacing.lg : metrics.spacing.sm,
            gap: size === BUTTON_SIZES.LARGE ? metrics.spacing.sm : metrics.spacing.xs,

            backgroundColor: color,
            borderRadius: metrics.buttonRadius,

            color: colors.darkSuccess,
        },
        uiStyles.lightShadow,
        style,
    ];

    return (
        <TouchableOpacity style={buttonStyles} onPress={onPress}>
            <BackgroundGradient />
            {children}
        </TouchableOpacity>
    );
}
