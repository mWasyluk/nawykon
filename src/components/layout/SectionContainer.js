import { metrics } from "@styles";
import { StyleSheet, View } from "react-native";

export default function SectionContainer({ style = {}, children }) {
    return (
        <View style={[styles.container, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: metrics.spacing.sm,
        marginTop: metrics.spacing.md,
        marginHorizontal: metrics.spacing.sm,
    },
});
