import { HeaderText } from "@components/text";
import routes from "@constants/router";
import { colors, icons, metrics, uiStyles } from "@styles";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { NavButton } from "./NavButton";

export const NavHeader = ({ title, back, home }) => {
    return (
        <View style={styles.container}>
            {back && <NavButton icon={icons.circleLeft} onPress={() => router.back()} />}
            <HeaderText style={styles.title}>{title}</HeaderText>
            {home && <NavButton icon={icons.home} onPress={() => router.push(routes.home)} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: metrics.spacing.sm,
        height: metrics.headerHeight,

        backgroundColor: colors.modalBackground,
        ...uiStyles.lightShadow,
    },
    title: {
        flex: 1,
        marginLeft: metrics.spacing.sm,
    },
});
