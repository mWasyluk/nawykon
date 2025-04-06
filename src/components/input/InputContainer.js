import BackgroundGradient from "@components/effects/BackgroundGradient";
import { colors, metrics, uiStyles } from "@styles";
import { TouchableOpacity } from "react-native";

export const INPUT_VARIANTS = {
    DEFAULT: "DEFAULT",
    PRIME: "PRIME",
    ERROR: "ERROR",
    DISABLED: "DISABLED",
}

export const INPUT_SIZES = {
    DEFAULT: "DEFAULT",
    LARGE: "LARGE",
    AUTO: "AUTO",
}

export default function InputContainer(props) {
    const {
        children,
        variant = INPUT_VARIANTS.DEFAULT,
        size = INPUT_SIZES.DEFAULT,
        style = {},
        onPress = () => { },
    } = props;

    let backgroundColor;
    switch (variant) {
        case INPUT_VARIANTS.DISABLED && INPUT_VARIANTS.LOADING:
            backgroundColor = colors.light;
            break;
        case INPUT_VARIANTS.ERROR:
            backgroundColor = colors.lightError;
            break;
        case INPUT_VARIANTS.PRIME:
            backgroundColor = colors.primBlue;
            break;
        default:
            backgroundColor = colors.modalBackground;
    }

    let height, paddingHorizontal, paddingVertical, gap;
    switch (size) {
        case INPUT_SIZES.LARGE:
            height = metrics.buttonSize.lg;
            paddingHorizontal = metrics.spacing.lg;
            paddingVertical = undefined;
            gap = metrics.spacing.sm;
            break;
        case INPUT_SIZES.AUTO:
            height = undefined;
            paddingHorizontal = metrics.spacing.sm;
            paddingVertical = metrics.spacing.sm;
            gap = metrics.spacing.xs;
            break;
        default:
            height = metrics.buttonSize.sm;
            paddingHorizontal = metrics.spacing.sm;
            paddingVertical = undefined;
            gap = metrics.spacing.xs;
    }

    const buttonStyles = [
        {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',

            height,
            paddingHorizontal,
            paddingVertical,
            gap,

            backgroundColor,
            outlineStyle: 'none',
            borderRadius: metrics.buttonRadius,
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
