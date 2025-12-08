import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

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
  return (
    <View style={styles.container}>
      {data.map((item, index) => {
        const percentage = total > 0 ? (item.value / total) * 100 : 0;
        const ItemWrapper = onCategoryPress ? TouchableOpacity : View;

        return (
          <ItemWrapper
            key={item.name}
            style={styles.item}
            onPress={onCategoryPress ? () => onCategoryPress(item) : undefined}
            activeOpacity={0.7}
          >
            <View style={styles.header}>
              <View style={styles.nameContainer}>
                <Text style={styles.emoji}>{item.emoji}</Text>
                <Text style={styles.name}>{item.name}</Text>
              </View>
              <Text style={styles.amount}>{formatCurrency(item.value, currencySymbol)}</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${percentage}%`, backgroundColor: item.color },
                ]}
              />
            </View>
            <Text style={styles.percentage}>{percentage.toFixed(1)}%</Text>
          </ItemWrapper>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  item: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
