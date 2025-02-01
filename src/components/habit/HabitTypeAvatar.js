import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { types as habitTypes } from '@data/habit';
import { colors } from '@styles';

export default function HabitTypeAvatar(props) {
    const {
        type = 'fitness',
        backgroundColor = colors.light,
        tintColor = colors.midGray,
    } = props;

    const habitType = habitTypes[type];

    return (
        <View style={{ ...styles.habitIconContainer, backgroundColor: backgroundColor }}>
            <Image source={habitType.icon}
                style={styles.habitIcon}
                tintColor={tintColor} />
        </View>
    );
}

const styles = StyleSheet.create({
    habitIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.lightGray,
    },
    habitIcon: {
        width: 32,
        height: 32,
    }
});
