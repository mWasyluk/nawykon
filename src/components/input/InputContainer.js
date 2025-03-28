import BackgroundGradient from "@components/effects/BackgroundGradient";
import { colors, metrics, uiStyles } from "@styles";
import { TouchableOpacity } from "react-native";

export const INPUT_VARIANTS = {
    DEFAULT: colors.modalBackground,
    ERROR: colors.lightError,
    PRIME: colors.primBlue,
    DISABLED: colors.light,
}

export const INPUT_SIZES = {
    DEFAULT: metrics.buttonSize.sm,
    LARGE: metrics.buttonSize.lg,
    AUTO: 'auto',
}

export default function InputContainer(props) {
    const {
        children,
        variant = INPUT_VARIANTS.DEFAULT,
        size = INPUT_SIZES.DEFAULT,
        style = {},
        onPress = () => { },
    } = props;

    const buttonStyles = [
        {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',

            height: size,
            paddingHorizontal: size === INPUT_SIZES.LARGE ? metrics.spacing.lg : metrics.spacing.sm,
            gap: size === INPUT_SIZES.LARGE ? metrics.spacing.sm : metrics.spacing.xs,

            outlineStyle: 'none',
            backgroundColor: variant,
            borderRadius: metrics.buttonRadius,
        },
        size === INPUT_SIZES.AUTO && {
            paddingVertical: metrics.spacing.sm
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
