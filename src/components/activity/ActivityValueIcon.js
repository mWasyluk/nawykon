import { BodyBoldText } from "@components/text";
import { metrics } from "@styles";
import { Image, StyleSheet, View } from "react-native";

export default function ActivityValueIcon({ value, icon }) {
    return (
        <View style={styles.container}>
            <BodyBoldText>{value}</BodyBoldText>
            <Image source={icon} style={styles.icon} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: metrics.imageSize.sm,
        height: metrics.imageSize.sm,
    },
});
