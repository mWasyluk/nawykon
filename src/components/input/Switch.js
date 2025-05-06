import BackgroundGradient from '@components/effects/BackgroundGradient';
import { colors, metrics } from '@styles';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import InputContainer, { INPUT_VARIANTS } from './InputContainer';

const TOGGLE_SIZE = 20;
const ANIMATION_DURATION = 200;

export default function Switch(props) {
    const {
        isOn = false,
        onChange = () => { },
    } = props;

    const slideAnimation = useRef(new Animated.Value(isOn ? 1 : 0)).current;

    const buttonVariant = isOn ? INPUT_VARIANTS.PRIME : INPUT_VARIANTS.DEFAULT;

    const toggleStyle = [
        styles.toggle,
        {
            backgroundColor: isOn ? colors.darkBlue : colors.midGray,
            left: slideAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, metrics.buttonSize.sm - TOGGLE_SIZE]
            })
        }
    ]

    const handleChange = () => {
        const newState = !isOn;
        onChange(newState);
    };

    useEffect(() => {
        Animated.timing(slideAnimation, {
            toValue: isOn ? 1 : 0,
            duration: ANIMATION_DURATION,
            useNativeDriver: false,
        }).start();
    }, [isOn, slideAnimation]);

    return (
        <InputContainer variant={buttonVariant} style={styles.container} onPress={handleChange}>
            <Animated.View style={toggleStyle}>
                <BackgroundGradient />
            </Animated.View>
        </InputContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        width: metrics.buttonSize.sm,
        height: TOGGLE_SIZE,
        borderRadius: metrics.borderRadius.circular,
    },
    toggle: {
        position: 'absolute',
        width: TOGGLE_SIZE,
        height: TOGGLE_SIZE,
        borderRadius: metrics.borderRadius.circular,
    },
});
