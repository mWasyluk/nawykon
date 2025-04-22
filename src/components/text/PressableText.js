import { colors } from "@styles";
import { TouchableOpacity } from "react-native";
import { ActionText } from "./styledTexts";

export function PressableText(props) {
    const {
        children,
        color = colors.darkBlue,
        disabled = false,
        onPress = () => { },
        containerStyle = {},
        style = {},
        ...otherProps
    } = props;

    const textStyles = [
        { color: disabled ? colors.lightGray : color },
        style,
    ];

    const containerStyles = [
        { alignSelf: 'flex-start' },
        containerStyle,
    ];

    return (
        <TouchableOpacity disabled={disabled} style={containerStyles} onPress={onPress}>
            <ActionText style={textStyles} {...otherProps}>
                {children}
            </ActionText>
        </TouchableOpacity>
    );
}
