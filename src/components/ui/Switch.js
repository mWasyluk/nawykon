import React, { useState } from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors, icons } from '@styles';

export default function Switch(props) {
    const {
        defaultState = false,
        onChange = () => { },
        style = {},
    } = props;

    const [toggled, setToggled] = useState(defaultState);

    const handleToggle = () => {
        const newToggled = !toggled;
        setToggled(newToggled);
        onChange(newToggled);
    };

    const switchStyle = {
        borderColor: toggled ? colors.lightSuccess : colors.lightGray,
    }

    return (
        <TouchableOpacity style={[styles.container, switchStyle, style]} onPress={handleToggle}>
            {toggled && <Image source={icons.check} style={styles.icon} tintColor={colors.lightSuccess} />}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: colors.light,
        borderWidth: 2,
    },
    icon: {
        width: 20,
        height: 20,
    },
});
