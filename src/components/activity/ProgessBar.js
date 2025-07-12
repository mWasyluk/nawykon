import { colors } from "@styles";
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

export function ProgressBar({ value, maxValue }) {
    const ratio = maxValue > 0 ? value / maxValue : 0;
    const animatedRatio = useRef(new Animated.Value(ratio)).current;

    useEffect(() => {
        Animated.timing(animatedRatio, {
            toValue: ratio,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();
    }, [ratio, animatedRatio]);

    const widthInterpolated = animatedRatio.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.container}>
            <View style={styles.bg}>
                <Animated.View
                    style={[
                        styles.fg,
                        { width: widthInterpolated },
                    ]}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 20,
        justifyContent: 'center',
    },
    bg: {
        backgroundColor: colors.lightGray,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: colors.lightGray,
        borderRadius: 10,
        justifyContent: 'center',
    },
    fg: {
        height: 10,
        borderRadius: 10,
        backgroundColor: colors.lightSuccess,
    },
});
