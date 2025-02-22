import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';
import { SelectList } from 'react-native-dropdown-select-list';
import { colors } from './Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URI } from '@/constants/API';
import axios from 'axios';

// Sample transaction data structure
const sampleTransactions = [
  { id: 1, amount: 50, category: 'Food', date: '2024-02-01T12:00:00' },
  { id: 2, amount: 30, category: 'Transport', date: '2024-02-02T15:30:00' },
  { id: 3, amount: 100, category: 'Shopping', date: '2024-02-05T18:20:00' },
  { id: 4, amount: 25, category: 'Food', date: '2024-02-10T09:15:00' },
  { id: 5, amount: 80, category: 'Bills', date: '2024-02-15T14:45:00' },
];

const Analyse = () => {
  const screenWidth = Dimensions.get('window').width;
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [sampleTransactions2, setSampleTranctions] = useState([]);


  useEffect(() => {
    const fetchTransanctionsByCategory = async () => {
      console.log("hello")
      const userId = await AsyncStorage.getItem('userId');
      console.log(userId)
      const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const endDate = new Date();
      const reponse = await axios.get(`${API_URI}/spendings/category-distribution?userId=${userId}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
      const processsedResponse = Object.entries(reponse.data).map(([key, value]) => ({
        id: key,
        amount: value.totalAmount,
        category: key
      }));
      setSampleTranctions(processsedResponse)
    }
    fetchTransanctionsByCategory();
  }, [])
  // Process transactions for different visualizations
  const processTransactions = () => {
    // Group by category for pie chart
    const categoryTotals = sampleTransactions.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

    // Group by date for line chart (last 7 days)
    const dates = [...new Set(sampleTransactions.map(t =>
      new Date(t.date).toISOString().split('T')[0]
    ))].sort();

    const dailyTotals = dates.map(date => {
      const total = sampleTransactions
        .filter(t => t.date.startsWith(date))
        .reduce((sum, t) => sum + t.amount, 0);
      return total;
    });

    return {
      categoryData: Object.entries(categoryTotals).map(([name, amount]) => ({
        name,
        amount,
        color: getRandomColor(),
        legendFontColor: '#7F7F7F',
        legendFontSize: 12
      })),
      lineData: {
        labels: dates.map(d => d.split('-')[2]), // Show only day
        datasets: [{
          data: dailyTotals
        }]
      }
    };
  };

  const { categoryData, lineData } = processTransactions();

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    decimalPlaces: 0
  };

  // Helper function for random colors
  function getRandomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Expense Analytics</Text>

      {/* Time Period Selector */}
      <View style={styles.selectorContainer}>
        <SelectList
          setSelected={setSelectedPeriod}
          data={[
            { key: 'week', value: 'Last 7 Days' },
            { key: 'month', value: 'This Month' },
            { key: 'year', value: 'This Year' }
          ]}
          defaultOption={{ key: 'week', value: 'Last 7 Days' }}
          boxStyles={styles.selector}
          dropdownStyles={styles.dropdown}
          inputStyles={styles.input}
          dropdownTextStyles={styles.input}
          disabledTextStyles={{ color: colors.dark.text }}

        />
      </View>

      {/* Daily Spending Trend */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Daily Spending Trend</Text>
        <LineChart
          data={lineData}
          width={screenWidth - 80}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Category Distribution */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Spending by Category</Text>
        <PieChart
          data={categoryData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          style={styles.chart}
        />
      </View>

      {/* Top Expenses */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Recent Transactions</Text>
        {sampleTransactions.slice(0, 5).map(transaction => (
          <View key={transaction.id} style={styles.transactionItem}>
            <Text style={styles.categoryText}>{transaction.category}</Text>
            <Text style={styles.amountText}>₹{transaction.amount}</Text>
            <Text style={styles.dateText}>
              {new Date(transaction.date).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
    color: colors.dark.text,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark.text,
    marginBottom: 20,
  },
  selectorContainer: {
    marginBottom: 20,
    color: colors.dark.text
  },
  selector: {
    borderRadius: 8,
    borderColor: colors.dark.border,
    color: colors.dark.text,
  },
  chartContainer: {
    backgroundColor: colors.dark.secondary,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    color: colors.dark.text,
  },
  dropdown: {
    backgroundColor: colors.dark.secondary,
    borderColor: colors.dark.border,
    color: colors.dark.text,
  },
  input: {
    color: colors.dark.text,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: colors.dark.text,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.dark.secondary,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border,
  },
  categoryText: {
    flex: 1,
    fontSize: 16,
    color: colors.dark.text,
  },
  amountText: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
    color: colors.dark.text,
  },
  dateText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
});

export default Analyse;