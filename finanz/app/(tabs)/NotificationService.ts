import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

class NotificationService {
  constructor() {
    this.configure();
  }

  configure = async () => {
    // if (!Device.isDevice) {
    //   Alert.alert('Error', 'Must use a physical device for push notifications.');
    //   return;
    // }

    // Request permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert('Permission required', 'Please enable notifications in settings.');
      return;
    }

    // Get the Expo push token
    const { data: token } = await Notifications.getExpoPushTokenAsync();
    console.log('Expo Push Token:', token);

    // Handle foreground notifications
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  };

  // Schedule a notification for expense reminder
  scheduleMonthlyExpenseNotification = async (expense) => {
    if (!expense.notificationEnabled) return;

    const dueDate = new Date(expense.dueDate);
    const notificationDate = new Date(dueDate);
    notificationDate.setDate(dueDate.getDate() - 1); // 1 day before

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Upcoming Expense Reminder',
        body: `${expense.name} payment of ₹${expense.amount} is due tomorrow`,
        sound: true,
      },
      trigger: { date: notificationDate, repeats: true },
    });
  };

  // Check if the user exceeds the category limit
  checkCategoryLimit = async (newExpense) => {
    try {
      const limitsStr = await AsyncStorage.getItem('categoryLimits');
      const limits = limitsStr ? JSON.parse(limitsStr) : {};

      const expensesStr = await AsyncStorage.getItem('monthlyExpenses');
      const monthlyExpenses = expensesStr ? JSON.parse(expensesStr) : {};

      const currentMonth = new Date().getMonth();
      const category = newExpense.category;

      if (limits[category]) {
        const currentTotal = (monthlyExpenses[currentMonth]?.[category] || 0) + Number(newExpense.amount);

        if (currentTotal > limits[category]) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Category Limit Exceeded',
              body: `Your ${category} expenses (₹${currentTotal}) have exceeded the limit of ₹${limits[category]}`,
              sound: true,
            },
            trigger: null,
          });
        } else if (currentTotal > limits[category] * 0.8) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Category Limit Warning',
              body: `Your ${category} expenses (₹${currentTotal}) are nearing the limit of ₹${limits[category]}`,
              sound: true,
            },
            trigger: null,
          });
        }
      }
    } catch (error) {
      console.error('Error checking category limits:', error);
    }
  };

  // Update stored monthly expenses
  updateMonthlyExpenses = async (expense) => {
    try {
      const currentMonth = new Date().getMonth();
      const expensesStr = await AsyncStorage.getItem('monthlyExpenses');
      const monthlyExpenses = expensesStr ? JSON.parse(expensesStr) : {};

      if (!monthlyExpenses[currentMonth]) {
        monthlyExpenses[currentMonth] = {};
      }

      if (!monthlyExpenses[currentMonth][expense.category]) {
        monthlyExpenses[currentMonth][expense.category] = 0;
      }

      monthlyExpenses[currentMonth][expense.category] += Number(expense.amount);
      await AsyncStorage.setItem('monthlyExpenses', JSON.stringify(monthlyExpenses));
    } catch (error) {
      console.error('Error updating monthly expenses:', error);
    }
  };

  // Cancel a scheduled notification
  cancelNotification = async (identifier) => {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  };

  // Test notification
  testNotification = async () => {
    console.log("Test notification");
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Test Notification',
        body: 'This is a test notification using expo-notifications.',
        sound: true,
      },
      trigger: null,
    });
  };
}

export default new NotificationService();
