import BackgroundGradient from "@components/effects/BackgroundGradient";
import { CaptionText } from "@components/text";
import { colors } from "@styles";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

const BAR_BORDER_RADIUS = 10;
const FLAT_BAR_HEIGHT = 8;
const LABEL_HEIGHT = 14;

export function BarChart(props) {
    const {
        width = '100%',
        height = '100%',
        data = [], // [{ x: label, y: value }]
    } = props;

    const [containerHeight, setContainerHeight] = useState(0);

    var maxY = 0;
    var minY = 0;

    data.forEach(({ y }) => {
        if (y > maxY) maxY = y;
        if (y < minY) minY = y;
    });

    const ySpan = maxY + Math.abs(minY);
    const stepHeight = ySpan ? (containerHeight - LABEL_HEIGHT) / ySpan : 0;
    const emptyChartTopMargin = ySpan === 0 ? containerHeight / 2 - LABEL_HEIGHT : 0;
    const positiveHeight = maxY * stepHeight || emptyChartTopMargin || 0;

    const showEverySecond = data.length > 20;
    const isLastXEven = data.length % 2 === 0;

    const bars = [];
    for (let i = 0; i < data.length; i++) {
        const { x, y } = data[i];

        let backgroundColor;
        if (i > 0) {
            const prevY = data[i - 1].y;
            backgroundColor = y > prevY ? colors.lightSuccess : y < prevY ? colors.lightError : colors.lightWarning;
        } else {
            backgroundColor = y > 0 ? colors.lightSuccess : y < 0 ? colors.lightError : colors.lightWarning;
        }

        const height = stepHeight * Math.abs(y) || FLAT_BAR_HEIGHT;
        const top = y < 0 ? positiveHeight : y > 0 ? positiveHeight - y * stepHeight : positiveHeight - FLAT_BAR_HEIGHT / 2;
        const zIndex = y === 0 ? 1 : 0;
        const borderRadiusProps = {
            borderTopLeftRadius: y >= 0 ? BAR_BORDER_RADIUS : 0,
            borderTopRightRadius: y >= 0 ? BAR_BORDER_RADIUS : 0,
            borderBottomLeftRadius: y <= 0 ? BAR_BORDER_RADIUS : 0,
            borderBottomRightRadius: y <= 0 ? BAR_BORDER_RADIUS : 0,
        }

        const barContainerStyle = {
            flex: 1,
            zIndex,
            alignItems: 'center',
        }

        const barStyle = {
            ...borderRadiusProps,
            position: 'relative',
            top,
            height,
            backgroundColor,
            width: '100%',
        }

        const showLabel = showEverySecond ? i % 2 === (isLastXEven ? 1 : 0) : true;

        bars.push(
            <View key={i} style={barContainerStyle} >
                <View style={barStyle}>
                    <BackgroundGradient />
                </View >
                {showLabel && <CaptionText style={styles.label}>{x}</CaptionText>}
            </View >
        );
    }

    const onLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        setContainerHeight(height);
    };

    return (
        <View style={[styles.container, { width, height }]} onLayout={onLayout} >
            {bars}
            <View style={[styles.separator, { top: positiveHeight }]}></View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 2,
        paddingHorizontal: 2,
    },
    label: {
        position: 'absolute',
        bottom: 0,
        textAlign: 'center',
        minWidth: 20,
        height: LABEL_HEIGHT,
    },
    separator: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 2,
        transform: [{ translateY: -1 }],
        backgroundColor: colors.midGray,
        borderRadius: 2,
    },
});
