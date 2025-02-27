import { BodyText } from '@components/text';
import { colors, icons } from '@styles';
import { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function TextOptionPicker(props) {
    const {
        options = [],
        initIndex = 0,
        loop = false,
        onOptionChange = () => { },
        style = {},
    } = props;

    const [currentIndex, setCurrentIndex] = useState(initIndex || 0);

    const canHandleNext = () => currentIndex < options.length - 1 || loop;
    const canHandlePrevious = () => currentIndex > 0 || loop;

    const handleNext = () => {
        if (!canHandleNext()) {
            return;
        }
        const nextIndex = (currentIndex + 1) % options.length;
        setCurrentIndex(nextIndex);
        onOptionChange(options[nextIndex]);
    };

    const handlePrevious = () => {
        if (!canHandlePrevious()) {
            return;
        }
        const prevIndex = (currentIndex - 1 + options.length) % options.length;
        setCurrentIndex(prevIndex);
        onOptionChange(options[prevIndex]);
    };

    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity onPress={handlePrevious}>
                <Image source={icons.circleLeft}
                    style={styles.icon}
                    tintColor={canHandlePrevious() ? colors.darkGray : colors.lightGray} />
            </TouchableOpacity>

            <BodyText style={styles.text}>{options[currentIndex]}</BodyText>

            <TouchableOpacity onPress={handleNext}>
                <Image source={icons.circleRight}
                    style={styles.icon}
                    tintColor={canHandleNext() ? colors.darkGray : colors.lightGray} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'end',
    },
    icon: {
        width: 24,
        height: 24,
    },
    text: {
        color: colors.darkGray,
        width: 100,
        textAlign: 'center',
    }
});
