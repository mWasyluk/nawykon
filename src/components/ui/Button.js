import React from 'react';
import { Text, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { colors, fontStyles, uiStyles } from '@styles';

export default function Button(props) {
    const {
        title,
        href = undefined,
        onPress = () => { },
        icon = null,
        small = false,
        prim = true,
        disabled = false,
        style = {},
        textStyle = {},
    } = props;


    const buttonStyles = [
        small ? uiStyles.smallButton : uiStyles.button,
        {
            backgroundColor: prim && !disabled ? colors.primBlue : colors.light,
            borderColor: prim && !disabled ? colors.primBlue : colors.lightGray,
        },
        style,
    ];

    const textColor = disabled ? colors.lightGray : prim ? colors.light : colors.darkGray;

    const textStyles = [
        { color: textColor },
        fontStyles.button,
        textStyle,
    ];

    const iconStyle = {
        width: small ? 16 : 24,
        height: small ? 16 : 24,
    };

    const handlePress = () => {
        onPress();
        if (href && !disabled) {
            router.push(href);
        };
    };

    return (
        <TouchableOpacity style={buttonStyles} onPress={handlePress}>
            {icon && <Image source={icon} style={iconStyle} tintColor={textColor} />}
            {title && <Text style={textStyles}>{title}</Text>}
        </TouchableOpacity>
    );
}
