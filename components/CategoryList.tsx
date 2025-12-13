import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Shadows } from '@/constants/theme';

interface CategoryData {
  name: string;
  emoji: string;
  value: number;
  color: string;
}

interface CategoryListProps {
  data: CategoryData[];
  total: number;
  currencySymbol: string;
  onCategoryPress?: (item: CategoryData) => void;
}

const formatCurrency = (amount: number, symbol: string) => {
  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

export const CategoryList = ({ data, total, currencySymbol, onCategoryPress }: CategoryListProps) => {
  const { width } = useWindowDimensions();

  // Determine number of columns based on screen width
  const numColumns = width >= 1024 ? 3 : width >= 768 ? 2 : 1;
  const isMultiColumn = numColumns > 1;

  // Group items into rows for multi-column layout
  const rows = [];
  if (isMultiColumn) {
    for (let i = 0; i < data.length; i += numColumns) {
      rows.push(data.slice(i, i + numColumns));
    }
  }

  const renderItem = (item: CategoryData) => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0;
    const ItemWrapper = onCategoryPress ? TouchableOpacity : View;

    // Dynamic font sizes based on screen width
    const emojiSize = width >= 1024 ? 32 : width >= 768 ? 28 : 24;
    const nameSize = width >= 1024 ? 18 : width >= 768 ? 17 : 16;
    const amountSize = width >= 1024 ? 18 : width >= 768 ? 17 : 16;
    const percentageSize = width >= 1024 ? 14 : width >= 768 ? 13 : 12;
    const progressBarHeight = width >= 1024 ? 10 : width >= 768 ? 9 : 8;
    const itemPadding = width >= 1024 ? 20 : width >= 768 ? 18 : 16;

    return (
      <ItemWrapper
        key={item.name}
        style={[styles.item, isMultiColumn && styles.itemMultiColumn, { padding: itemPadding }]}
        onPress={onCategoryPress ? () => onCategoryPress(item) : undefined}
        activeOpacity={0.7}
      >
        <View style={styles.header}>
          <View style={styles.nameContainer}>
            <Text style={[styles.emoji, { fontSize: emojiSize }]}>{item.emoji}</Text>
            <Text style={[styles.name, { fontSize: nameSize }]}>{item.name}</Text>
          </View>
          <Text style={[styles.amount, { fontSize: amountSize }]}>{formatCurrency(item.value, currencySymbol)}</Text>
        </View>
        <View style={[styles.progressBarContainer, { height: progressBarHeight }]}>
          <View
            style={[
              styles.progressBar,
              { width: `${percentage}%`, backgroundColor: item.color },
            ]}
          />
        </View>
        <Text style={[styles.percentage, { fontSize: percentageSize }]}>{percentage.toFixed(1)}%</Text>
      </ItemWrapper>
    );
  };

  if (isMultiColumn) {
    return (
      <View style={styles.container}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((item) => (
              <View key={item.name} style={{ flex: 1 }}>
                {renderItem(item)}
              </View>
            ))}
            {/* Add empty placeholders to maintain grid alignment */}
            {row.length < numColumns &&
              Array.from({ length: numColumns - row.length }).map((_, i) => (
                <View key={`placeholder-${i}`} style={{ flex: 1 }} />
              ))}
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {data.map((item) => renderItem(item))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  item: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    ...Shadows.soft,
  },
  itemMultiColumn: {
    minHeight: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  emoji: {
    fontSize: 24,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    fontFamily: 'Nunito_600SemiBold',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    fontFamily: 'Nunito_700Bold',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  percentage: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Nunito_400Regular',
  },
});
