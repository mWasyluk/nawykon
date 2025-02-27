import { colors } from "@styles";
import { StyleSheet } from "react-native";
import { CaptionText } from "./styledTexts";

export function OptionalErrorText(props) {
    const { children, style, ...otherProps } = props;

    if (!children) {
        return null;
    }

    return (
        <CaptionText style={[styles.error, style]} {...otherProps}>{children}</CaptionText>
    );
}

const styles = StyleSheet.create({
    error: {
        marginTop: -10,
        color: colors.darkError,
    },
});
