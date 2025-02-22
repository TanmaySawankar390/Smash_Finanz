// src/theme/useThemedStyles.ts
import { StyleSheet } from 'react-native';
import { useTheme } from './ThemeContext';
import { colors } from './Colors';

export const useThemedStyles = () => {
  const { theme } = useTheme();
  const themeColors = colors[theme];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    card: {
      backgroundColor: themeColors.card,
      borderRadius: 12,
      padding: 16,
      marginVertical: 8,
      marginHorizontal: 16,
      shadowColor: theme === 'dark' ? '#000' : '#888',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: themeColors.text,
    },
    subtitle: {
      fontSize: 16,
      color: themeColors.textSecondary,
    },
    input: {
      backgroundColor: themeColors.inputBackground,
      color: themeColors.text,
      borderRadius: 8,
      padding: 12,
      marginVertical: 8,
    },
    button: {
      backgroundColor: themeColors.primary,
      borderRadius: 8,
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    balanceCard: {
      backgroundColor: themeColors.balanceCard,
      padding: 20,
      borderRadius: 16,
      marginVertical: 16,
      marginHorizontal: 16,
    },
    balanceText: {
      color: themeColors.balanceCardText,
      fontSize: 32,
      fontWeight: 'bold',
    },
    transactionItem: {
      backgroundColor: themeColors.card,
      flexDirection: 'row',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.border,
    },
    transactionText: {
      color: themeColors.text,
      fontSize: 16,
    },
    amountText: {
      fontSize: 16,
      fontWeight: '600',
    },
    incomeText: {
      color: themeColors.income,
    },
    expenseText: {
      color: themeColors.expense,
    },
  });

  return { styles, colors: themeColors };
};