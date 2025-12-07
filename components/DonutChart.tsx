import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, G, Circle } from 'react-native-svg';

interface DonutChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  size?: number;
  strokeWidth?: number;
  gap?: number; // Gap between segments in degrees
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 200,
  strokeWidth = 30,
  gap = 4,
}) => {
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;

  // Calculate total value
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#E5E5E5"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
        </Svg>
      </View>
    );
  }

  // Helper function to convert polar coordinates to cartesian
  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    // Convert to radians and adjust so 0 degrees is at top (12 o'clock)
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  // Create arc path
  const describeArc = (
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number
  ): string => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    const d = [
      'M', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(' ');

    return d;
  };

  let currentAngle = 0;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <G>
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const segmentAngle = (percentage / 100) * 360;

            if (segmentAngle <= 0) return null;

            // Each segment: start after gap/2, end before gap/2
            const startAngle = currentAngle + (gap / 2);
            const endAngle = currentAngle + segmentAngle - (gap / 2);

            // Move current angle forward for next segment
            currentAngle += segmentAngle;

            // Don't render if the segment is too small after gap
            if (endAngle - startAngle <= 0) return null;

            const path = describeArc(center, center, radius, startAngle, endAngle);

            return (
              <Path
                key={`segment-${index}`}
                d={path}
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeLinecap="butt"
                fill="transparent"
              />
            );
          })}
        </G>
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
