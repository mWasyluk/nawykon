import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

export default function PieChart({ data, innerRadius = 40 }) {
    const total = data.reduce((sum, { value }) => sum + value, 0);
    let cumulativeAngle = 0;

    const polarToCartesian = (centerX, centerY, radius, angleDeg) => {
        const radians = ((angleDeg - 90) * Math.PI) / 180;
        return {
            x: centerX + radius * Math.cos(radians),
            y: centerY + radius * Math.sin(radians),
        };
    };

    if (total === 0) {
        return (
            <View style={styles.container}>
                <Svg viewBox={`0 0 100 100`}>
                    <Circle cx="50" cy="50" r="50" fill="#E0E0E0" />
                    {innerRadius > 0 && <Circle cx="50" cy="50" r={innerRadius} fill="white" />}
                </Svg>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Svg viewBox={`0 0 100 100`}>
                {data.map(({ value, color }, index) => {
                    const angle = (value / total) * 360;
                    const adjAngle = angle === 360 ? 359.99 : angle;
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
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
});
