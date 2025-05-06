import { useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Svg, { Defs, Rect, Circle, Filter, FeGaussianBlur } from 'react-native-svg';

const BlurredBackground = ({
    color = 'rgba(255,255,255,0.6)',
    blurRadius = 10,
    shape = 'rectangle'
}) => {
    const blurredComponent = useMemo(() => {
        // Web implementation
        if (Platform.OS === 'web') {
            return (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: color,
                    filter: `blur(${blurRadius}px)`,
                    borderRadius: shape === 'circle' ? '50%' : '0',
                }} />
            );
        }

        // Mobile implementation
        return (
            <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                <Defs>
                    <Filter
                        id="blur"
                        x="-50%"
                        y="-50%"
                        width="200%"
                        height="200%"
                    >
                        <FeGaussianBlur in="SourceGraphic" stdDeviation={blurRadius} />
                    </Filter>
                </Defs>
                {shape === 'circle' ? (
                    <Circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        fill={color}
                        filter="url(#blur)"
                    />
                ) : (
                    <Rect
                        x="5%"
                        y="5%"
                        width="90%"
                        height="90%"
                        fill={color}
                        filter="url(#blur)"
                    />
                )}
            </Svg>
        );
    }, [color, blurRadius, shape]);

    return (
        <View style={StyleSheet.absoluteFill}>
            {blurredComponent}
        </View>
    );
};

export default BlurredBackground;
