import { useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

const BackgroundGradient = () => {
    const gradientComponent = useMemo(() => {

        // Web
        if (Platform.OS === 'web') {
            return (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 100% 0%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 80%)'
                }} />
            );
        }

        // Mobile
        return (
            <Svg height="100%" width="100%" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                <Defs>
                    <RadialGradient id="radialGradient" gradientUnits="objectBoundingBox" cx={1} cy={0} r={1}>
                        <Stop offset="0" stopColor="white" stopOpacity={0.2} />
                        <Stop offset="0.8" stopColor="white" stopOpacity={0} />
                    </RadialGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#radialGradient)" />
            </Svg>
        );
    }, []);

    return (
        <View style={StyleSheet.absoluteFill}>
            {gradientComponent}
        </View>
    );
};

export default BackgroundGradient;
