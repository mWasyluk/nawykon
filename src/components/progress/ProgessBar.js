import { colors } from "@styles";
import { StyleSheet } from "react-native";
import { View } from "react-native-web";

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
        border: `2px solid ${colors.lightGray}`,
        borderRadius: 10,
        justifyContent: 'center',
    },
    fg: {
        height: 10,
        borderRadius: 10,
        backgroundColor: colors.lightSuccess,
    },
});
