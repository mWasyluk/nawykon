import { colors, fontStyles } from "@styles";
import { Text } from "react-native";

export default function TextOption(props) {
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
