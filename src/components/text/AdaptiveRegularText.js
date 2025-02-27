import { colors, fontStyles } from "@styles";
import { Text } from "react-native";

export function AdaptiveRegularText(props) {
    const {
        disabled = false,
        children,
    } = props;

    const textStyle = {
        ...fontStyles.regular,
        color: disabled ? colors.lightGray : colors.midGray,
    };

    return (
        <Text style={textStyle}>{children}</Text>
    );
}
