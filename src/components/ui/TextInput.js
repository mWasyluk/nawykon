import { View, Text, TextInput as DefaultTextInput, StyleSheet } from 'react-native';
import { colors, fontStyles, uiStyles } from '@styles';
import { useState } from 'react';

const DEFAULT_HEIGHT = 32;
const MAX_HEIGHT = 64;

export default function TextInput(props) {
    const {
        value = '',
        label = '',
        onChange = () => { },
        keyboardType = 'text',
        maxLength = undefined,
        secureTextEntry = false,
        multiline = false,
        returnKeyType = 'done',
        disabled = false,
        short = false,
        error = null,
    } = props;

    const [isFocused, setIsFocused] = useState(false);
    const [height, setHeight] = useState(DEFAULT_HEIGHT);
    const [charWidth, setCharWidth] = useState(0);

    const handleTextChange = (text) => {
        onChange(text);
    }

    const handleHeightChange = (event) => {
        const contentHeight = event.nativeEvent.contentSize.height;

        if (contentHeight >= MAX_HEIGHT) {
            setHeight(MAX_HEIGHT);
        } else if (contentHeight >= DEFAULT_HEIGHT) {
            setHeight(contentHeight);
        } else {
            setHeight(DEFAULT_HEIGHT);
        }
    }

    // Funkcja pomocnicza do pomiaru szerokości litery "W"
    const handleMeasureLayout = (event) => {
        const { width } = event.nativeEvent.layout;
        setCharWidth(width);
    };

    // Wyliczenie docelowej szerokości
    // Zostanie użyte tylko wtedy, gdy `maxLength` jest zdefiniowane    
    var computedWidth = maxLength && charWidth
        ? charWidth * maxLength
        : undefined;

    if (computedWidth && !short) {
        computedWidth += uiStyles.input.paddingLeft * 2;
    }

    const viewstyle = [
        styles.container,
        {
            width: computedWidth,
        }
    ]

    const labelStyle = [
        styles.label,
        {
            display: label ? undefined : 'none',
        }
    ]

    const textInputStyle = [
        uiStyles.input,
        {
            borderColor: error ? colors.darkError : isFocused ? colors.primBlue : colors.lightGray,
            color: disabled ? colors.lightGray : isFocused ? colors.darkGray : colors.midGray,
            height: height,
            width: computedWidth,
            textAlign: maxLength ? 'center' : undefined
        }
    ];

    return (
        <View style={viewstyle}>
            {/* Ukryty komponent <Text> mierzący szerokość litery „W” w czcionce <TextInput>. */}
            <Text style={styles.hiddenMeasureText} onLayout={handleMeasureLayout}>W</Text>

            <Text style={labelStyle}>{label}</Text>
            <DefaultTextInput
                style={textInputStyle}
                disabled={disabled}
                value={value}
                onChangeText={handleTextChange}
                multiline={multiline}
                returnKeyType={returnKeyType}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onContentSizeChange={handleHeightChange}
                maxLength={maxLength}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    label: {
        marginLeft: 10,
        color: colors.darkGray,
        ...fontStyles.textFieldLabel,
    },
    hiddenMeasureText: {
        position: 'absolute',
        opacity: 0,
        ...fontStyles.regular,
    }
});
