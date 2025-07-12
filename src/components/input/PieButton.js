import { LoadingIndicator } from '@components/layout';
import { TitleText } from '@components/text';
import { colors, metrics, uiStyles } from '@styles';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const BUTTON_SIZE = 50;
const STROKE_WIDTH = 5;
const RADIUS = (BUTTON_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ANIMATION_DURATION = 200;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function PieButton({
    count = 0,
    maxCount = 1,
    onPress = () => { },
    isLoading = false,
}) {
    const initialRatio = maxCount > 0 ? count / maxCount : 0;
    const ratio = useRef(new Animated.Value(initialRatio)).current;

    useEffect(() => {
        const targetRatio = maxCount > 0 ? count / maxCount : 0;
        ratio.stopAnimation();
        Animated.timing(ratio, {
            toValue: targetRatio,
            duration: ANIMATION_DURATION,
            easing: Easing.linear,
            useNativeDriver: Platform.OS !== 'web',
        }).start();
    }, [count, maxCount, ratio]);

    const dashOffset = ratio.interpolate({
        inputRange: [0, 1],
        outputRange: [CIRCUMFERENCE, 0],
    });

    const textStyle = {
        color: count >= maxCount ? colors.darkSuccess : colors.midGray,
        position: 'absolute',
    };

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <View style={styles.container}>
                <Svg width={BUTTON_SIZE} height={BUTTON_SIZE}>
                    <Circle
                        stroke={colors.lightGray}
                        fill="none"
                        cx={BUTTON_SIZE / 2}
                        cy={BUTTON_SIZE / 2}
                        r={RADIUS}
                        strokeWidth={STROKE_WIDTH}
                    />
                    <AnimatedCircle
                        stroke={colors.lightSuccess}
                        fill="none"
                        cx={BUTTON_SIZE / 2}
                        cy={BUTTON_SIZE / 2}
                        r={RADIUS}
                        strokeWidth={STROKE_WIDTH}
                        strokeDasharray={`${CIRCUMFERENCE}, ${CIRCUMFERENCE}`}
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                        transform={`rotate(-90, ${BUTTON_SIZE / 2}, ${BUTTON_SIZE / 2})`}
                    />
                </Svg>
                {isLoading ? (
                    <LoadingIndicator
                        size={metrics.imageSize.sm}
                        style={{ position: 'absolute' }}
                    />
                ) : (
                    <TitleText style={textStyle}>
                        {count}/{maxCount}
                    </TitleText>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        borderRadius: metrics.borderRadius.circular,
        ...uiStyles.lightShadow,
    }
});
