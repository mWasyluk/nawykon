import { NavButton } from '@components/navigation/NavButton';
import { ActionText, TitleText } from '@components/text';
import routes from '@constants/router';
import { colors, icons, metrics, uiStyles } from '@styles';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

const todaysDate = new Date();
const dayOfWeek = todaysDate.toLocaleString('default', { weekday: 'long' });
const day = todaysDate.getDate();
const month = todaysDate.toLocaleString('default', { month: 'long' });

export default function DashboardNavHeader() {
    return (
        <View style={styles.container}>
            <View>
                <TitleText style={styles.title}>{dayOfWeek}</TitleText>
                <ActionText style={styles.more}>{day} {month}</ActionText>
            </View>
            <NavButton icon={icons.settings} onPress={() => router.push(routes.settings)} />
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: metrics.spacing.sm,
        height: metrics.headerHeight,
        
        backgroundColor: colors.modalBackground,
        ...uiStyles.lightShadow,
    },
    title: {
        color: colors.darkGray,
    },
    more: {
        color: colors.midGray,
    },
});

