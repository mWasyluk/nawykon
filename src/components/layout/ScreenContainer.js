import { metrics } from "@styles";
import { ScrollView, StyleSheet } from "react-native";

export default function ScreenContainer({ children, style }) {
    return (
        <ScrollView style={[styles.container, style]}>
            {children}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: metrics.spacing.md,
    },
});
