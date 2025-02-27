import { colors, fontStyles } from '@styles';
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const SIZE = 50; // Rozmiar przycisku
const STROKE_WIDTH = 5; // Grubość okręgu
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const PieButton = (props) => {
    const {
        count = 0,
        maxCount = 1,
        onPress = () => { }
    } = props;

    const progress = maxCount > 0 ? count / maxCount : 0;
    const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <View style={styles.container}>
                <Svg width={SIZE} height={SIZE}>
                    <Circle
                        stroke={colors.lightGray}
                        fill="none"
                        cx={SIZE / 2}
                        cy={SIZE / 2}
                        r={RADIUS}
                        strokeWidth={STROKE_WIDTH}
                    />
                    <Circle
                        stroke={colors.lightSuccess}
                        fill="none"
                        cx={SIZE / 2}
                        cy={SIZE / 2}
                        r={RADIUS}
                        strokeWidth={STROKE_WIDTH}
                        strokeDasharray={`${CIRCUMFERENCE}, ${CIRCUMFERENCE}`}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                </Svg>
                <Text style={styles.text}>{count}/{maxCount}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    text: {
        position: 'absolute',
        ...fontStyles.regularTitle,
    },
});

export default PieButton;
