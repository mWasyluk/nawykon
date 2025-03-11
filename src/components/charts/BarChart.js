import BackgroundGradient from "@components/effects/BackgroundGradient";
import { CaptionText } from "@components/text";
import { Statistics } from "@models/reports/Statistics";
import { colors } from "@styles";
import { validateTimestamp } from "@utils/dateUtil";
import { useLayoutEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { View } from "react-native-web";

const BAR_BORDER_RADIUS = 10;
const FLAT_BAR_HEIGHT = 8;
const LABEL_HEIGHT = 14;

export function BarChart(props) {
    const {
        width = '100%',
        height = '100%',
        dailyStats = {},
    } = props;

    const [containerHeight, setContainerHeight] = useState(0);
    const ref = useRef(null);

    const progressData = [];
    var maxY = 0;
    var minY = 0;

    Object.entries(dailyStats).reduce((sum, [date, stats]) => {
        var x, y;
        x = validateTimestamp(date).getDate();
        y = stats.status === Statistics.STATUSES.COMPLETED ? sum += 1
            : stats.status === Statistics.STATUSES.FAILED ? sum -= 1
                : sum;

        progressData.push({ x, y });
        if (sum > maxY) maxY = sum;
        if (sum < minY) minY = sum;

        return sum;
    }, 0);

    const ySpan = maxY + Math.abs(minY);
    const stepHeight = (containerHeight - LABEL_HEIGHT) / ySpan;
    const positiveHeight = maxY * stepHeight;
    const isLastXEven = progressData.length % 2 === 0;

    const bars = [];
    for (let i = 0; i < progressData.length; i++) {
        const { x, y } = progressData[i];

        let backgroundColor;
        if (i > 0) {
            const prevY = progressData[i - 1].y;
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

        const barStyle = {
            ...borderRadiusProps,
            position: 'relative',
            top,
            height,
            backgroundColor,
        }

        const showLabel = i % 2 === (isLastXEven ? 1 : 0);

        bars.push(
            <View key={i} style={{ flex: 1, zIndex }} >
                <View style={barStyle}>
                    <BackgroundGradient />
                </View >
                {showLabel && <CaptionText style={styles.label}>{x}</CaptionText>}
            </View >
        );
    }

    useLayoutEffect(() => {
        const { height } = ref.current.getBoundingClientRect();
        setContainerHeight(height);
    }, []);

    return (
        <View style={[styles.container, { width, height }]} ref={ref} >
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
        alignSelf: 'center',
    },
    separator: {
        position: 'absolute',
        width: '100%',
        height: 2,
        left: 0,
        transform: [{ translateY: -1 }],
        backgroundColor: colors.midGray,
        borderRadius: 2,
    },
});
