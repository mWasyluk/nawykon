import { colors } from "@styles";
import { BodyText } from "./styledTexts";

export function AdaptiveRegularText(props) {
    const {
        disabled = false,
        children,
    } = props;

    const textStyle = {
        color: disabled ? colors.lightGray : colors.midGray,
    };

    return (
        <BodyText style={textStyle}>{children}</BodyText>
    );
}
