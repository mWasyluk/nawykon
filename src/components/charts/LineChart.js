import React from 'react';
import { View } from 'react-native';
import { Svg, Path, Text as SvgText, Line } from 'react-native-svg';
import { colors, fontStyles } from '@styles';

export default function LineChart({
    data = [],
    currentPoints = undefined,
    width = 320,
    height = 220,
    strokeColor = '#3b82f6',
    strokeWidth = 6,
    textColor = colors.midGray,
    avoidNegatives = false,
}) {
    const margin = { top: 20, right: 20, bottom: 20, left: 40 };
    const wrappedData = data.map((item, i) => ({
        originalX: item.x,           // do etykiety
        wrappedX: i,   // do obliczeń
        y: item.y
    }));

    // 2. Obliczamy "initial" jeśli mamy currentPoints
    //    (czyli chcemy, żeby ostatni punkt w tablicy wyniósł currentPoints)
    const sumOfAllY = wrappedData.reduce((acc, item) => acc + (typeof item.y === 'number' ? item.y : 0), 0);
    const initial = currentPoints !== undefined ? currentPoints - sumOfAllY : 0;

    // 3. Budujemy tablicę z akumulacją Y
    let currentY = initial;
    const accumulatedData = wrappedData.map((item) => {
        const nextY = currentY + (typeof item.y === 'number' ? item.y : 0);
        currentY = nextY > 0 ? nextY : (avoidNegatives ? 0 : nextY);
        return {
            originalX: item.originalX,
            wrappedX: item.wrappedX,
            y: currentY,
        };
    });

    // 4. Wyciągamy wszystkie "wrappedX" (do obliczeń) i y
    const allWrappedX = accumulatedData.map((p) => p.wrappedX);
    const allY = accumulatedData.map((p) => p.y);

    // 5. Zakres Y z zapasem
    const realMinY = Math.min(...allY);
    const realMaxY = Math.max(...allY);
    const chartMinY = realMinY - 1;
    const chartMaxY = realMaxY + 1;

    // 6. Zakres "wrappedX"
    const minWrappedX = Math.min(...allWrappedX);
    const maxWrappedX = Math.max(...allWrappedX);

    // 7. Funkcja do skalowania X – uwzględnia "wrappedX"
    const scaleX = (v) => {
        if (maxWrappedX - minWrappedX === 0) {
            return margin.left + (width - margin.left - margin.right) / 2;
        }
        const factor = (v - minWrappedX) / (maxWrappedX - minWrappedX);
        return margin.left + factor * (width - margin.left - margin.right);
    };

    // 8. Skalowanie Y (odwrócone, bo w SVG „w dół” to większa wartość)
    const scaleY = (v) => {
        if (chartMaxY - chartMinY === 0) {
            return margin.top + (height - margin.top - margin.bottom) / 2;
        }
        const factor = (v - chartMinY) / (chartMaxY - chartMinY);
        return height - margin.bottom - factor * (height - margin.top - margin.bottom);
    };

    // 9. Funkcja do rysowania ścieżki "monotonicznej" (z wykorzystaniem "wrappedX")
    const buildMonotonePath = (points) => {
        if (!points.length) return '';
        // Skalujemy w oparciu o "wrappedX" oraz y
        const scaled = points.map((p) => ({
            x: scaleX(p.wrappedX),
            y: scaleY(p.y),
        }));
        if (scaled.length === 1) return `M ${scaled[0].x},${scaled[0].y}`;

        const px = scaled.map((p) => p.x);
        const py = scaled.map((p) => p.y);
        const n = scaled.length;
        const slopes = [];

        for (let i = 0; i < n - 1; i++) {
            const dx = px[i + 1] - px[i];
            slopes.push(dx === 0 ? 0 : (py[i + 1] - py[i]) / dx);
        }

        const t = new Array(n);
        t[0] = slopes[0];
        for (let i = 1; i < n - 1; i++) {
            const s1 = slopes[i - 1];
            const s2 = slopes[i];
            t[i] = s1 * s2 <= 0 ? 0 : (s1 + s2) / 2;
        }
        t[n - 1] = slopes[n - 2];

        // Korekta overshoot
        for (let i = 0; i < n - 1; i++) {
            const dx = px[i + 1] - px[i];
            const dy = py[i + 1] - py[i];
            if (dy === 0) {
                t[i] = 0;
                t[i + 1] = 0;
                continue;
            }
            const cm = (t[i] + t[i + 1]) / slopes[i];
            if (cm > 3) {
                t[i] = (3 * t[i] * slopes[i]) / cm;
                t[i + 1] = (3 * t[i + 1] * slopes[i]) / cm;
            }
        }

        let d = `M ${px[0]},${py[0]}`;
        for (let i = 0; i < n - 1; i++) {
            const x0 = px[i],
                y0 = py[i],
                x1 = px[i + 1],
                y1 = py[i + 1],
                dx = x1 - x0;
            const c1x = x0 + dx / 3,
                c1y = y0 + (t[i] * dx) / 3,
                c2x = x1 - dx / 3,
                c2y = y1 - (t[i + 1] * dx) / 3;
            d += ` C ${c1x},${c1y} ${c2x},${c2y} ${x1},${y1}`;
        }
        return d;
    };

    // 10. Generujemy ścieżkę
    const pathData = buildMonotonePath(accumulatedData);

    // 11. Przygotowujemy punkty do rysowania linii pionowych i etykiet
    const scaledPoints = accumulatedData.map((pt) => ({
        // xVal => oryginalny X, który chcemy wyświetlić
        xVal: pt.originalX,
        // do rysowania
        x: scaleX(pt.wrappedX),
        y: scaleY(pt.y),
    }));

    // 12. Ticki Y (bez min i max)
    const yTicks = [];
    for (let val = Math.ceil(chartMinY + 1); val <= Math.floor(chartMaxY - 1); val++) {
        yTicks.push(val);
    }

    // 13. Skrócone linie pionowe
    const verticalTop = scaleY(chartMaxY) + 5;
    const verticalBottom = scaleY(chartMinY) - 5;

    const xLabelStep = scaledPoints.length >= 25 ? 4 : scaledPoints.length >= 15 ? 2 : 1;
    const yLabelStep = yTicks.length >= 25 ? 4 : yTicks.length >= 15 ? 2 : 1;

    return (
        <View style={{ alignItems: 'center' }}>
            <Svg width={width} height={height}>
                {/* Linie poziome (oś Y) i etykiety */}
                {yTicks.map((val, i) => (
                    <React.Fragment key={`y-${val}`}>
                        <Line
                            x1={margin.left - 5}
                            y1={scaleY(val)}
                            x2={width - margin.right + 5}
                            y2={scaleY(val)}
                            stroke={colors.lightGray}
                            strokeWidth={i % yLabelStep === 0 ? 2 : 0.5}
                        />
                        {i % yLabelStep === 0 && (
                            <SvgText
                                x={margin.left - 10}
                                y={scaleY(val)}
                                fill={textColor}
                                fontFamily={fontStyles.regularNote.fontFamily}
                                fontSize={fontStyles.regularNote.fontSize}
                                textAnchor="end"
                                alignmentBaseline="middle"
                            >
                                {val}
                            </SvgText>
                        )}
                    </React.Fragment>
                ))}

                {/* Linie pionowe i etykiety osi X */}
                {scaledPoints.map((p, i) => (
                    <React.Fragment key={`x-${i}`}>
                        <Line
                            x1={p.x}
                            y1={verticalTop}
                            x2={p.x}
                            y2={verticalBottom}
                            stroke={colors.lightGray}
                            strokeWidth={i % xLabelStep === 0 ? 2 : 0.5}
                        />
                        {i % xLabelStep === 0 && (
                            <SvgText
                                x={p.x}
                                y={verticalBottom + 15}
                                fill={textColor}
                                fontFamily={fontStyles.regularNote.fontFamily}
                                fontSize={fontStyles.regularNote.fontSize}
                                textAnchor="middle"
                            >
                                {p.xVal}
                            </SvgText>
                        )}
                    </React.Fragment>
                ))}

                {/* Ścieżka wykresu */}
                <Path
                    d={pathData}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </Svg>
        </View>
    );
}
