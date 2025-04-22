import { LoadingIndicator } from '@components/layout';
import { TitleText } from '@components/text';
import { colors, metrics, uiStyles } from '@styles';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const BUTTON_SIZE = 50;
const STROKE_WIDTH = 5;
const RADIUS = (BUTTON_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ANIMATION_DURATION = 200;
const ANIMATION_STEPS = 20;

const PieButton = (props) => {
    const {
        count = 0,
        maxCount = 1,
        onPress = () => { },
        isLoading = false,
    } = props;

    const [dashOffset, setDashOffset] = useState(CIRCUMFERENCE.toString());
    const animationRef = useRef(null);
    const prevCountRef = useRef(count);

    useEffect(() => {
        const prevRatio = maxCount > 0 ? prevCountRef.current / maxCount : 0;
        const targetRatio = maxCount > 0 ? count / maxCount : 0;

        const startOffset = CIRCUMFERENCE * (1 - prevRatio);
        const endOffset = CIRCUMFERENCE * (1 - targetRatio);

        if (animationRef.current) {
            clearInterval(animationRef.current);
        }

        const step = (endOffset - startOffset) / ANIMATION_STEPS;
        let currentStep = 0;
        let currentOffset = startOffset;

        const animate = () => {
            currentStep++;

            if (currentStep <= ANIMATION_STEPS) {
                currentOffset = startOffset + step * currentStep;
                setDashOffset(currentOffset.toString());
            } else {
                setDashOffset(endOffset.toString());
                clearInterval(animationRef.current);
            }
        };

        const intervalTime = ANIMATION_DURATION / ANIMATION_STEPS;
        animationRef.current = setInterval(animate, intervalTime);

        prevCountRef.current = count;

        return () => {
            if (animationRef.current) {
                clearInterval(animationRef.current);
            }
        };
    }, [count, maxCount]);

    const textStyle = {
        color: count && count >= maxCount ? colors.darkSuccess : colors.midGray,
        position: 'absolute',
    }


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
                    <Circle
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
                    <LoadingIndicator size={metrics.imageSize.sm} style={{ position: 'absolute' }} />
                ) : (
                    <TitleText style={textStyle}>{count}/{maxCount}</TitleText>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        borderRadius: metrics.borderRadius.circular,
        ...uiStyles.lightShadow,
    }
});

export default PieButton;
