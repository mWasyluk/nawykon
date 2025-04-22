import { colors, metrics } from "@styles";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

export const NavButton = ({ icon, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <Image source={icon} style={styles.image} tintColor={colors.midGray} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: metrics.spacing.xs,
    },
    image: {
        width: metrics.imageSize.sm,
        height: metrics.imageSize.sm,
    },
});
