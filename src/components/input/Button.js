import { LoadingIndicator } from "@components/layout";
import { ActionLargeText, ActionText } from "@components/text";
import { colors, metrics } from "@styles";
import { Image, StyleSheet } from "react-native";
import InputContainer, { INPUT_SIZES, INPUT_VARIANTS } from "./InputContainer";

export const LOADING_ICON = 'loading';

export default function Button(props) {
    const {
        icon,
        title,
        variant = INPUT_VARIANTS.DEFAULT,
        size = INPUT_SIZES.DEFAULT,
        ...otherProps
    } = props;

    const imageStyle = size === INPUT_SIZES.LARGE ? styles.largeImage : styles.smallImage;
    const textStyle = {
        color: variant === INPUT_VARIANTS.DISABLED ? colors.lightGray
            : variant === INPUT_VARIANTS.DEFAULT ? colors.midGray
                : colors.light
    };

    return (
        <InputContainer variant={variant} size={size} {...otherProps}>
            {icon && (icon === LOADING_ICON
                ? <LoadingIndicator size={imageStyle.height} />
                : <Image source={icon} style={imageStyle} tintColor={textStyle.color} />)}
            {title && (
                size === INPUT_SIZES.LARGE
                    ? <ActionLargeText style={textStyle}>{title}</ActionLargeText>
                    : <ActionText style={textStyle}>{title}</ActionText>
            )}
        </InputContainer>
    );
}

const styles = StyleSheet.create({
    smallImage: {
        width: metrics.imageSize.xs,
        height: metrics.imageSize.xs,
    },
    largeImage: {
        width: metrics.imageSize.sm,
        height: metrics.imageSize.sm
    }
});
