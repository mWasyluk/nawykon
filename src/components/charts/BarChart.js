import BackgroundGradient from "@components/effects/BackgroundGradient";
import { CaptionText } from "@components/text";
import { colors } from "@styles";
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

const BAR_BORDER_RADIUS = 10;
const FLAT_BAR_HEIGHT = 8;
const LABEL_HEIGHT = 14;
const ANIMATION_DURATION = 300;

export function BarChart({
    width = '100%',
    height = '100%',
    data = [], // [{ x: label, y: value }]
}) {
    const [containerHeight, setContainerHeight] = useState(0);
    const [animatedData, setAnimatedData] = useState([]);
    const [animatedSepTop, setAnimatedSepTop] = useState(0);

    const prevDataRef = useRef([]);
    const prevYsRef = useRef([]);
    const prevHeightsRef = useRef([]);
    const prevTopsRef = useRef([]);
    const prevRadiiRef = useRef([]);
    const prevSepRef = useRef(0);

    useEffect(() => {
        if (containerHeight <= 0) return;

        const nextYs = data.map(d => d.y);
        const nextMax = Math.max(0, ...nextYs);
        const nextMin = Math.min(0, ...nextYs);
        const nextSpan = nextMax + Math.abs(nextMin);
        const nextStep = nextSpan ? (containerHeight - LABEL_HEIGHT) / nextSpan : 0;
        const nextSep = nextMax * nextStep || (nextSpan === 0 ? containerHeight / 2 - LABEL_HEIGHT : 0);

        const nextHeights = nextYs.map(y => nextStep * Math.abs(y) || FLAT_BAR_HEIGHT);
        const nextTops = nextYs.map((y, i) =>
            y < 0 ? nextSep : y > 0 ? nextSep - nextHeights[i] : nextSep - FLAT_BAR_HEIGHT / 2
        );
        const nextRadii = nextYs.map(y => computeRadii(y));
        const nextColors = nextYs.map((y, i) => computeColor(y, i, data));

        if (prevDataRef.current.length !== data.length) {
            prevDataRef.current = data;
            prevYsRef.current = nextYs;
            prevHeightsRef.current = nextHeights;
            prevTopsRef.current = nextTops;
            prevRadiiRef.current = nextRadii;
            prevSepRef.current = nextSep;

            setAnimatedSepTop(nextSep);
            setAnimatedData(data.map((d, i) => ({
                x: d.x,
                y: nextYs[i],
                height: nextHeights[i],
                top: nextTops[i],
                backgroundColor: nextColors[i],
                borderProps: nextRadii[i],
            })));
            return;
        }

        const prevYs = prevYsRef.current;
        const prevMax = Math.max(0, ...prevYs);
        const prevMin = Math.min(0, ...prevYs);
        const prevSpan = prevMax + Math.abs(prevMin);
        const prevStep = prevSpan ? (containerHeight - LABEL_HEIGHT) / prevSpan : 0;
        const prevSep = prevMax * prevStep || (prevSpan === 0 ? containerHeight / 2 - LABEL_HEIGHT : 0);

        const prevHeights = prevYs.map(y => prevStep * Math.abs(y) || FLAT_BAR_HEIGHT);
        const prevTops = prevYs.map((y, i) =>
            y < 0 ? prevSep : y > 0 ? prevSep - prevHeights[i] : prevSep - FLAT_BAR_HEIGHT / 2
        );
        const prevRadii = prevRadiiRef.current;
        const prevColors = prevYs.map((y, i) => computeColor(y, i, prevDataRef.current));

        const progress = new Animated.Value(0);
        const listener = progress.addListener(({ value: p }) => {
            setAnimatedSepTop(prevSep + (nextSep - prevSep) * p);
            setAnimatedData(data.map((d, i) => {
                const h = prevHeights[i] + (nextHeights[i] - prevHeights[i]) * p;
                const t = prevTops[i] + (nextTops[i] - prevTops[i]) * p;
                const rp = {
                    borderTopLeftRadius: prevRadii[i].borderTopLeftRadius + (nextRadii[i].borderTopLeftRadius - prevRadii[i].borderTopLeftRadius) * p,
                    borderTopRightRadius: prevRadii[i].borderTopRightRadius + (nextRadii[i].borderTopRightRadius - prevRadii[i].borderTopRightRadius) * p,
                    borderBottomLeftRadius: prevRadii[i].borderBottomLeftRadius + (nextRadii[i].borderBottomLeftRadius - prevRadii[i].borderBottomLeftRadius) * p,
                    borderBottomRightRadius: prevRadii[i].borderBottomRightRadius + (nextRadii[i].borderBottomRightRadius - prevRadii[i].borderBottomRightRadius) * p,
                };
                const bg = blendColors(prevColors[i], nextColors[i], p);
                const currY = prevYs[i] + (nextYs[i] - prevYs[i]) * p;

                return {
                    x: d.x,
                    y: currY,
                    height: h,
                    top: t,
                    backgroundColor: bg,
                    borderProps: rp,
                };
            }));
        });

        Animated.timing(progress, {
            toValue: 1,
            duration: ANIMATION_DURATION,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start(() => {
            progress.removeListener(listener);
            prevDataRef.current = data;
            prevYsRef.current = nextYs;
            prevHeightsRef.current = nextHeights;
            prevTopsRef.current = nextTops;
            prevRadiiRef.current = nextRadii;
            prevSepRef.current = nextSep;
        });

        return () => {
            progress.stopAnimation();
            progress.removeListener(listener);
        };
    }, [data, containerHeight]);

    const onLayout = e => setContainerHeight(e.nativeEvent.layout.height);

    return (
        <View style={[styles.container, { width, height }]} onLayout={onLayout}>
            {animatedData.map((bar, i) => {
                const showEverySecond = data.length > 20;
                const isLastEven = data.length % 2 === 0;
                const showLabel = showEverySecond
                    ? i % 2 === (isLastEven ? 1 : 0)
                    : true;

                return (
                    <View key={bar.x} style={{ flex: 1, alignItems: 'center', zIndex: bar.y === 0 ? 1 : 0 }}>
                        <View
                            style={[
                                { width: '100%', position: 'relative', top: bar.top, height: bar.height, backgroundColor: bar.backgroundColor },
                                bar.borderProps
                            ]}
                        >
                            <BackgroundGradient />
                        </View>
                        {showLabel && <CaptionText style={styles.label}>{bar.x}</CaptionText>}
                    </View>
                );
            })}
            <View style={[styles.separator, { top: animatedSepTop }]} />
        </View>
    );
}

function computeRadii(y) {
    return {
        borderTopLeftRadius: y >= 0 ? BAR_BORDER_RADIUS : 0,
        borderTopRightRadius: y >= 0 ? BAR_BORDER_RADIUS : 0,
        borderBottomLeftRadius: y <= 0 ? BAR_BORDER_RADIUS : 0,
        borderBottomRightRadius: y <= 0 ? BAR_BORDER_RADIUS : 0,
    };
}

function computeColor(y, i, dataArr) {
    if (i > 0) {
        const prev = dataArr[i - 1].y;
        return y > prev ? colors.lightSuccess : y < prev ? colors.lightError : colors.lightWarning;
    }
    return y > 0 ? colors.lightSuccess : y < 0 ? colors.lightError : colors.lightWarning;
}

function blendColors(c1, c2, t) {
    const rgb1 = hexToRgb(c1);
    const rgb2 = hexToRgb(c2);
    return rgbToHex({
        r: Math.round(rgb1.r + (rgb2.r - rgb1.r) * t),
        g: Math.round(rgb1.g + (rgb2.g - rgb1.g) * t),
        b: Math.round(rgb1.b + (rgb2.b - rgb1.b) * t),
    });
}

function hexToRgb(hex) {
    const h = hex.replace('#', '');
    return {
        r: parseInt(h.substr(0, 2), 16),
        g: parseInt(h.substr(2, 2), 16),
        b: parseInt(h.substr(4, 2), 16),
    };
}

function rgbToHex({ r, g, b }) {
    const to2 = v => v.toString(16).padStart(2, '0');
    return `#${to2(r)}${to2(g)}${to2(b)}`;
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
