import { colors } from '@styles';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const ANIMATION_DURATION = 500;
const ANIMATION_STEPS = 30;
const STROKE_WIDTH = 10;

export default function LoadingIndicator({ size = '100%', style }) {
    const [rotation, setRotation] = useState(0);
    const animationRef = useRef(null);

    const RADIUS = (100 - STROKE_WIDTH) / 2;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

    useEffect(() => {
        const interval = ANIMATION_DURATION / ANIMATION_STEPS;
        const degreesPerStep = 360 / ANIMATION_STEPS;

        const animate = () => {
            setRotation(prevRotation => (prevRotation + degreesPerStep) % 360);
        };

        animationRef.current = setInterval(animate, interval);

        return () => {
            if (animationRef.current) {
                clearInterval(animationRef.current);
            }
        };
    }, []);

    return (
        <View style={[{ aspectRatio: 1, width: size, height: size }, style]}>
            <Svg width="100%" height="100%" viewBox="0 0 100 100">
                <Circle
                    stroke={colors.lightGray}
                    fill="none"
                    cx={50}
                    cy={50}
                    r={RADIUS}
                    strokeWidth={STROKE_WIDTH}
                />
                <Circle
                    stroke={colors.midGray}
                    fill="none"
                    cx={50}
                    cy={50}
                    r={RADIUS}
                    strokeWidth={STROKE_WIDTH}
                    strokeDasharray={`${CIRCUMFERENCE / 2}, ${CIRCUMFERENCE / 2}`}
                    strokeLinecap="round"
                    transform={`rotate(${rotation - 90}, 50, 50)`}
                />
            </Svg>
        </View>
    );
};
