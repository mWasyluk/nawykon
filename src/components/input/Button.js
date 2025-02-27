import { ActionLargeText, ActionText } from '@components/text';
import { colors, uiStyles } from '@styles';
import { router } from 'expo-router';
import { Image, TouchableOpacity } from 'react-native';

export default function Button(props) {
    const {
        title,
        href = undefined,
        onPress = () => { },
        icon = null,
        small = false,
        // TODO: implement prim as a variant
        prim = true,
        variant = undefined,
        disabled = false,
        style = {},
        textStyle = {},
    } = props;


    const buttonStyles = [
        small ? uiStyles.smallButton : uiStyles.button,
        {
            backgroundColor: disabled ? colors.light
                : variant === 'error' ? colors.lightError
                    : prim ? colors.primBlue
                        : colors.light,
            borderColor: disabled ? colors.lightGray
                : variant === 'error' ? colors.darkError
                    : prim ? colors.darkBlue
                        : colors.darkGray,
        },
        style,
    ];

    const textColor = disabled ? colors.lightGray
        : variant === 'error' ? colors.prim
            : prim ? colors.light
                : colors.darkGray;

    const textStyles = [
        { color: textColor },
        textStyle,
    ];

    const iconStyle = {
        width: small ? 16 : 24,
        height: small ? 16 : 24,
    };

    const handlePress = () => {
        if (disabled) return;
        onPress();
        if (href) {
            router.push(href);
        };
    };

    return (
        <TouchableOpacity style={buttonStyles} onPress={handlePress}>
            {icon && <Image source={icon} style={iconStyle} tintColor={textColor} />}
            {title &&
                (small ? <ActionText style={textStyles}>{title}</ActionText>
                    : <ActionLargeText style={textStyles}>{title}</ActionLargeText>)
            }
        </TouchableOpacity>
    );
}
