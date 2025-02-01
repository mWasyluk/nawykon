import { colors, fontStyles } from "@styles";
import { StyleSheet, Text } from "react-native";

export default function ErrorMessage(props) {
    const { children, style, ...otherProps } = props;

    if (!children) {
        return null;
    }

    return (
        <Text style={[styles.error, style]} {...otherProps}>{children}</Text>
    );
}

const styles = StyleSheet.create({
    error: {
        ...fontStyles.regularNote,
        marginTop: -10,
        color: colors.darkError,
    },
});
