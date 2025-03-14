import { colors, metrics } from "@styles";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

export const NavButton = ({ icon, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <Image source={icon} style={styles.image} tintColor={colors.darkGray} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    image: {
        width: metrics.imageSize.md,
        height: metrics.imageSize.md,
    },
});
