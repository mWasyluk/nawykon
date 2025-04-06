import { colors, fontStyles, metrics } from "@styles";
import { useRef, useState } from "react";
import { TextInput as ReactTextInput, StyleSheet } from "react-native";
import InputContainer, { INPUT_SIZES, INPUT_VARIANTS } from "./InputContainer";

const INPUT_TEXT_STYLE = fontStyles.body;

export default function TextInput(props) {
    const {
        value = '',
        onChange = () => { },
        error = null,
        multiline = false,

        variant,
        style = {},
        textStyle = {},

        outerRef = null,
        onFocus,
        onBlur,
        ...otherProps
    } = props;

    const inputRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);

    const buttonStyle = [
        {
            borderWidth: 2,
            borderColor: error ? colors.darkError
                : isFocused ? colors.primBlue
                    : 'transparent',
            height: multiline ? INPUT_SIZES.LARGE : INPUT_SIZES.DEFAULT,
        },
        style,
    ]

    const textInputStyle = [
        styles.input,
        INPUT_TEXT_STYLE,
        {
            zIndex: variant === INPUT_VARIANTS.DISABLED ? -1 : 1,
            color: variant === INPUT_VARIANTS.DISABLED ? colors.lightGray
                : isFocused ? colors.darkGray
                    : colors.midGray,
        },
        multiline && { textAlignVertical: 'top' },
        textStyle,
    ];

    const setRefs = (ref) => {
        inputRef.current = ref;
        if (outerRef) {
            outerRef.current = ref;
        }
    }

    const handleChange = (value) => {
        onChange(value);
    }

    const handleContainerPress = () => {
        if (variant !== INPUT_VARIANTS.DISABLED) {
            inputRef.current.focus();
        }
    }

    const handleFocus = () => {
        setIsFocused(true);
        onFocus?.();
    }

    const handleBlur = () => {
        onBlur?.();
        setIsFocused(false);
    }

    return (
        <InputContainer style={buttonStyle} variant={variant} onPress={handleContainerPress}>
            <ReactTextInput
                ref={setRefs}
                value={value}
                onChangeText={handleChange}

                multiline={multiline}
                numberOfLines={multiline ? 2 : 1}

                disabled={variant === INPUT_VARIANTS.DISABLED}
                onFocus={handleFocus}
                onBlur={handleBlur}

                style={textInputStyle}
                {...otherProps}
            />
        </InputContainer>
    )
}

const styles = StyleSheet.create({
    input: {
        zIndex: 1,
        width: '100%',
        height: '100%',

        paddingTop: metrics.spacing.xs,
        paddingBottom: metrics.spacing.xs,

        outlineStyle: 'none',
        overflow: 'hidden',

        backgroundColor: 'transparent',
    },
});
