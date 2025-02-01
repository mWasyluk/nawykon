import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { colors, fontStyles, icons } from '@styles';
import routes from '@data/router';
import ScreenSection from '@components/containers/ScreenSection';

const todaysDate = new Date();
const dayOfWeek = todaysDate.toLocaleString('default', { weekday: 'long' });
const day = todaysDate.getDate();
const month = todaysDate.toLocaleString('default', { month: 'long' });

export default function DateSettingsSection() {
    return (
        <ScreenSection containerStyle={styles.container}>
            <View>
                <Text style={styles.headerText}>{dayOfWeek}</Text>
                <Text style={styles.moreText}>{day} {month}</Text>
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
    headerText: {
        ...fontStyles.sectionHeader,
        color: colors.darkGray,
    },
    moreText: {
        ...fontStyles.sectionMore,
        color: colors.midGray,
    },
    image: {
        width: 48,
        height: 48,
    },
});

