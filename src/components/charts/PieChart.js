import React, { useRef, useState, useEffect } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

export default function AnimatedPieChart({ data, innerRadius = 40 }) {
    const total = data.reduce((sum, { value }) => sum + value, 0);
    const prevDataRef = useRef(data.map(slice => slice.value));

    const [animatedData, setAnimatedData] = useState(data);

    useEffect(() => {
        const prevValues = prevDataRef.current;
        const nextValues = data.map(slice => slice.value);

        const progress = new Animated.Value(0);
        const listenerId = progress.addListener(({ value: p }) => {
            const frameData = data.map(({ color }, i) => ({
                value: prevValues[i] + (nextValues[i] - (prevValues[i] || 0)) * p,
                color,
            }));
            setAnimatedData(frameData);
        });

        Animated.timing(progress, {
            toValue: 1,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start(() => {
            progress.removeListener(listenerId);
            prevDataRef.current = nextValues;
            setAnimatedData(data);
        });

        // cleanup
        return () => {
            progress.stopAnimation();
            progress.removeListener(listenerId);
        };
    }, [data]);

    if (total === 0) {
        return (
            <View style={styles.container}>
                <Svg viewBox="0 0 100 100">
                    <Circle cx="50" cy="50" r="50" fill="#E0E0E0" />
                    {innerRadius > 0 && (
                        <Circle cx="50" cy="50" r={innerRadius} fill="white" />
                    )}
                </Svg>
            </View>
        );
    }

    let cumulativeAngle = 0;
    const polarToCartesian = (cx, cy, r, deg) => {
        const rad = ((deg - 90) * Math.PI) / 180;
        return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    };

    return (
        <View style={styles.container}>
            <Svg viewBox="0 0 100 100">
                {animatedData.map(({ value, color }, index) => {
                    const sliceAngle = (value / total) * 360;
                    const adjAngle = sliceAngle === 360 ? 359.99 : sliceAngle;
                    const startAngle = cumulativeAngle;
                    const endAngle = startAngle + adjAngle;
                    cumulativeAngle += adjAngle;

                    const largeArcFlag = adjAngle > 180 ? 1 : 0;
                    const outerStart = polarToCartesian(50, 50, 50, startAngle);
                    const outerEnd = polarToCartesian(50, 50, 50, endAngle);
                    const innerStart = polarToCartesian(50, 50, innerRadius, startAngle);
                    const innerEnd = polarToCartesian(50, 50, innerRadius, endAngle);

                    const pathData = [
                        `M ${outerStart.x} ${outerStart.y}`,
                        `A 50 50 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
                        `L ${innerEnd.x} ${innerEnd.y}`,
                        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
                        'Z',
                    ].join(' ');

                    return <Path
                        key={`pie-chart-slice-${index}`}
                        d={pathData}
                        fill={color}
                    />;
                })}
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
});
