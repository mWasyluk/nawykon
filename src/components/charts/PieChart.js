import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function PieChart({ data, colors, size = 200, innerRadius = 40 }) {
  const total = data.reduce((sum, val) => sum + val, 0);
  let cumulativeAngle = 0;

  // Pomocnicza funkcja do przeliczeń biegunowych → kartezjańskie
  const polarToCartesian = (centerX, centerY, radius, angleDeg) => {
    const radians = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(radians),
      y: centerY + radius * Math.sin(radians),
    };
  };

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {data.map((value, index) => {
          // Wyznaczamy, jaki fragment koła przypada na wartość 'value'
          const angle = (value / total) * 360;
          const startAngle = cumulativeAngle;
          const endAngle = startAngle + angle;
          cumulativeAngle += angle;

          // Flaga do określenia, czy rysujemy duży łuk > 180°
          const largeArcFlag = angle > 180 ? 1 : 0;

          // Zewnętrzne punkty łuku
          const outerStart = polarToCartesian(size / 2, size / 2, size / 2, startAngle);
          const outerEnd = polarToCartesian(size / 2, size / 2, size / 2, endAngle);

          // Wewnętrzne punkty łuku
          const innerStart = polarToCartesian(size / 2, size / 2, innerRadius, startAngle);
          const innerEnd = polarToCartesian(size / 2, size / 2, innerRadius, endAngle);

          // Definicja ścieżki – „obrys” donut-a
          const pathData = [
            `M ${outerStart.x} ${outerStart.y}`,
            `A ${size / 2} ${size / 2} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
            `L ${innerEnd.x} ${innerEnd.y}`,
            `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
            'Z',
          ].join(' ');

          return <Path
            key={index}
            d={pathData}
            fill={colors[index]}
            stroke={'white'}
            strokeWidth={2} />;
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
