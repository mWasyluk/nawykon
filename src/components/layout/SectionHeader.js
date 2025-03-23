import { TitleText } from "@components/text";
import { colors, metrics } from "@styles";
import { StyleSheet, View } from "react-native";

export default function SectionHeader(props) {
    const {
        title,
        badge = null,
        right = null,
    } = props;

    return (
        <View style={styles.container}>
            <View style={styles.left}>
                <TitleText style={styles.title}>{title}</TitleText>
                {badge && badge}
            </View>
            {right && right}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: metrics.spacing.sm,
        minHeight: metrics.titleHeight,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: metrics.spacing.xs,
    },
    title: {
        color: colors.darkGray,
    },
});
