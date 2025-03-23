import { LabelText } from "@components/text";
import { colors, metrics } from "@styles";
import { StyleSheet, View } from "react-native";

export default function SubsectionHeader(props) {
    const {
        title = '',
        badge = null,
        right = null,
        isRequired = false,
        style = {},
    } = props;

    const titleStyle = {
        color: isRequired ? colors.darkGray : colors.midGray,
    };

    return (
        <View style={[styles.container, style]}>
            <View style={styles.left}>
                <LabelText style={[styles.title, titleStyle]}>{title}{isRequired && '*'}</LabelText>
                {badge}
            </View>
            {right}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: metrics.spacing.sm,
    },
    title: {
        marginRight: metrics.spacing.xs,
    },
});
