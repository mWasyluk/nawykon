import ScreenSection from '@components/layout/ScreenSection';
import { ActionText, TitleText } from '@components/text';
import routes from '@constants/router';
import { colors, icons } from '@styles';
import { router } from 'expo-router';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

const todaysDate = new Date();
const dayOfWeek = todaysDate.toLocaleString('default', { weekday: 'long' });
const day = todaysDate.getDate();
const month = todaysDate.toLocaleString('default', { month: 'long' });

export default function DateSettingsSection() {
    return (
        <ScreenSection containerStyle={styles.container}>
            <View>
                <TitleText style={styles.title}>{dayOfWeek}</TitleText>
                <ActionText style={styles.more}>{day} {month}</ActionText>
            </View>
            <TouchableOpacity onPress={() => router.push(routes.settings)}>
                <Image source={icons.settings} style={styles.image} />
            </TouchableOpacity>
        </ScreenSection>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        color: colors.darkGray,
    },
    more: {
        color: colors.midGray,
    },
    image: {
        width: 48,
        height: 48,
    },
});

