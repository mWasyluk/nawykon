import { HeaderText } from "@components/text";
import routes from "@constants/router";
import { colors, icons, metrics, uiStyles } from "@styles";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { NavButton } from "./NavButton";

export const NavHeader = ({ title, back, home }) => {
    const handleBackPress = () => {
        router.back();
    }

    const handleHomePress = () => {
        router.dismissAll();
        router.replace(routes.home);
    }

    return (
        <View style={styles.container}>
            {back && <NavButton icon={icons.arrowLeft} onPress={handleBackPress} />}
            <HeaderText style={styles.title}>{title}</HeaderText>
            {home && <NavButton icon={icons.home} onPress={handleHomePress} />}
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
