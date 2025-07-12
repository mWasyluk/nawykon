import { colors } from '@styles';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Platform } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const ANIMATION_DURATION = 500;
const STROKE_WIDTH = 10;

export default function LoadingIndicator({ size = '100%', style }) {
    const progress = useRef(new Animated.Value(0)).current;

    // Start loop
    useEffect(() => {
        Animated.loop(
            Animated.timing(progress, {
                toValue: 1,
                duration: ANIMATION_DURATION,
                easing: Easing.linear,
                useNativeDriver: Platform.OS !== 'web',
            })
        ).start();
    }, [progress]);

    const rotation = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const RADIUS = (100 - STROKE_WIDTH) / 2;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

    return (
        <Animated.View
            style={[
                { aspectRatio: 1, width: size, height: size },
                style,
                { transform: [{ rotate: rotation }] },
            ]}
        >
            <Svg width="100%" height="100%" viewBox="0 0 100 100">
                {/* background */}
                <Circle
                    stroke={colors.lightGray}
                    fill="none"
                    cx={50}
                    cy={50}
                    r={RADIUS}
                    strokeWidth={STROKE_WIDTH}
                />
                {/* rotating segment */}
                <Circle
                    stroke={colors.midGray}
                    fill="none"
                    cx={50}
                    cy={50}
                    r={RADIUS}
                    strokeWidth={STROKE_WIDTH}
                    strokeDasharray={`${CIRCUMFERENCE / 2}, ${CIRCUMFERENCE / 2}`}
                    strokeLinecap="round"
                />
            </Svg>
        </Animated.View>
    );
}
