import BackgroundGradient from "@components/effects/BackgroundGradient";
import { BodyBoldText, BodyText } from "@components/text";
import { colors, metrics } from "@styles";
import { StyleSheet, View } from "react-native";

export const VARIANTS = {
    success: { backgroundColor: colors.lightSuccess, valueColor: colors.light, labelColor: colors.lightSuccess },
    partial: { backgroundColor: colors.lightWarning, valueColor: colors.darkGray, labelColor: colors.darkWarning },
    fail: { backgroundColor: colors.lightError, valueColor: colors.light, labelColor: colors.lightError },
    neutral: { backgroundColor: colors.lightGray, valueColor: colors.darkGray, labelColor: colors.darkGray },
};

export default function ActivityStatisticsValue(props) {
    const {
        variant = VARIANTS.neutral,
        value = 0,
        label = '',
    } = props;

    return (
        <View style={[styles.container]}>
            <View style={[styles.valueContainer, { backgroundColor: variant.backgroundColor }]}>
                <BackgroundGradient />
                <BodyBoldText style={{ color: variant.valueColor }}>{value}</BodyBoldText>
            </View>
            <BodyText style={{ color: variant.labelColor }}>{label}</BodyText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: metrics.spacing.xs,
    },
    valueContainer: {
        minWidth: 40,
        alignItems: 'center',
        paddingHorizontal: metrics.spacing.sm,
        borderRadius: metrics.borderRadius.circular,
    },
});
