import BackgroundGradient from "@components/effects/BackgroundGradient";
import { LabelText } from "@components/text";
import { colors, metrics, uiStyles } from "@styles";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function TabToggle(props) {
    const { name, onPress, style, ...otherProps } = props;

    return (
        <TouchableOpacity style={[styles.container, style]} onPress={onPress} {...otherProps}>
            <BackgroundGradient />
            <LabelText style={styles.tabText}>{name}</LabelText>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: metrics.spacing.sm,
        borderRadius: metrics.borderRadius.sm,

        backgroundColor: colors.modalBackground,
        ...uiStyles.lightShadow,
    },
    tabText: {
        color: colors.midGray,
    },
});
