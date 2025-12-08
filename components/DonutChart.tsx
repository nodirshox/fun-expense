import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Svg, { Path, G, Circle } from 'react-native-svg';
import { Shadows } from '@/constants/theme';

interface DonutChartProps {
  data: Array<{
    name: string;
    emoji?: string;
    value: number;
    color: string;
  }>;
  size?: number;
  strokeWidth?: number;
  gap?: number; // Gap between segments in degrees
  onSegmentPress?: (item: { name: string; emoji?: string; value: number; color: string }) => void;
  currencySymbol?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  size = 200,
  strokeWidth = 30,
  gap = 4,
  onSegmentPress,
  currencySymbol = '$',
}) => {
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const [hoveredSegment, setHoveredSegment] = useState<{ item: any; x: number; y: number } | null>(null);

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

  // Calculate segment positions for touch areas
  const segmentData = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const segmentAngle = (percentage / 100) * 360;

    if (segmentAngle <= 0) return null;

    const startAngle = currentAngle + (gap / 2);
    const endAngle = currentAngle + segmentAngle - (gap / 2);
    currentAngle += segmentAngle;

    if (endAngle - startAngle <= 0) return null;

    // Calculate multiple touch points along the arc for better coverage
    const touchPoints = [];
    const numPoints = Math.max(1, Math.ceil(segmentAngle / 30)); // One touch point every 30 degrees

    for (let i = 0; i < numPoints; i++) {
      const angleOffset = (segmentAngle * i) / Math.max(1, numPoints - 1);
      const angle = startAngle + angleOffset;
      const angleRad = ((angle - 90) * Math.PI) / 180.0;
      const touchX = center + radius * Math.cos(angleRad);
      const touchY = center + radius * Math.sin(angleRad);
      touchPoints.push({ x: touchX, y: touchY });
    }

    // Also calculate center point for tooltip positioning
    const midAngle = (startAngle + endAngle) / 2;
    const midAngleRad = ((midAngle - 90) * Math.PI) / 180.0;
    const tooltipX = center + radius * Math.cos(midAngleRad);
    const tooltipY = center + radius * Math.sin(midAngleRad);

    return {
      item,
      startAngle,
      endAngle,
      touchPoints,
      tooltipX,
      tooltipY,
      path: describeArc(center, center, radius, startAngle, endAngle),
    };
  }).filter(Boolean);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <TouchableOpacity
        style={[StyleSheet.absoluteFill]}
        activeOpacity={1}
        onPress={() => setHoveredSegment(null)}
      >
        <View pointerEvents="none">
          <Svg width={size} height={size}>
            <G>
              {segmentData.map((segment, index) => (
                <Path
                  key={`segment-${index}`}
                  d={segment!.path}
                  stroke={segment!.item.color}
                  strokeWidth={strokeWidth}
                  strokeLinecap="butt"
                  fill="transparent"
                  onPress={onSegmentPress ? () => onSegmentPress(segment!.item) : undefined}
                />
              ))}
            </G>
          </Svg>
        </View>
      </TouchableOpacity>

      {/* Invisible touch areas over each segment */}
      {segmentData.map((segment, index) => {
        const touchSize = strokeWidth + 20; // Make touch area slightly larger
        return segment!.touchPoints.map((touchPoint, pointIndex) => (
          <TouchableOpacity
            key={`touch-${index}-${pointIndex}`}
            style={[
              styles.touchArea,
              {
                left: touchPoint.x - touchSize / 2,
                top: touchPoint.y - touchSize / 2,
                width: touchSize,
                height: touchSize,
              },
            ]}
            onPress={(e) => {
              e.stopPropagation();
              setHoveredSegment({ item: segment!.item, x: segment!.tooltipX, y: segment!.tooltipY });
              if (onSegmentPress) {
                onSegmentPress(segment!.item);
              }
            }}
            activeOpacity={0.7}
          />
        ));
      })}

      {/* Tooltip */}
      {hoveredSegment && (
        <View
          style={[
            styles.tooltip,
            {
              left: hoveredSegment.x,
              top: hoveredSegment.y - 50,
            },
          ]}
          pointerEvents="none"
        >
          <View style={styles.tooltipRow}>
            <Text style={styles.tooltipEmoji}>{hoveredSegment.item.emoji}</Text>
            <Text style={styles.tooltipName}>{hoveredSegment.item.name}</Text>
          </View>
          <Text style={styles.tooltipAmount}>
            {currencySymbol}{hoveredSegment.item.value.toLocaleString('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchArea: {
    position: 'absolute',
    borderRadius: 100,
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    paddingHorizontal: 16,
    ...Shadows.card,
    transform: [{ translateX: -50 }],
    minWidth: 120,
  },
  tooltipRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  tooltipEmoji: {
    fontSize: 20,
    marginRight: 6,
  },
  tooltipName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    fontFamily: 'Nunito_700Bold',
  },
  tooltipAmount: {
    fontSize: 14,
    fontWeight: '400',
    color: '#1a1a1a',
    fontFamily: 'Nunito_400Regular',
  },
});
