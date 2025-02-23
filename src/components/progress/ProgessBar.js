import { colors } from "@styles";
import { StyleSheet, View } from "react-native";

export function ProgressBar({ progress }) {
    return (
        <View style={styles.container}>
            <View style={styles.bg}>
                <View style={[styles.fg, { width: `${progress * 100}%` }]}></View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 20,
        justifyContent: 'center',
    },
    bg: {
        backgroundColor: colors.lightGray,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: colors.lightGray,
        borderRadius: 10,
        justifyContent: 'center',
    },
    fg: {
        height: 10,
        borderRadius: 10,
        backgroundColor: colors.lightSuccess,
    },
});
