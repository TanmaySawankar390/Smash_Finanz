import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';
import { Home, User, BarChart2, Calendar } from 'lucide-react-native';
import HomeScreen from './Home';
import Analyse from './Analyse';
import ProfileScreen from './ProfileScreen';
import ExpenseManager from './MonthlyExpenseScreen';
import { colors } from './Colors';
import { Image } from 'react-native';

const Tab = createBottomTabNavigator();

export default function TabsScreen() {
  return (
      <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.dark.secondary,
          borderTopWidth: 1,
          borderColor: colors.dark.border,
          shadowColor: 'rgba(0, 0, 0, 0.05)',
          shadowOffset: { width: 0, height: 1 },
          shadowRadius: 8,
          marginVertical:"auto"
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#B8B8C0',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.dark.secondary,
          shadowColor: 'transparent',
          borderBottomColor: colors.dark.border,
          borderBottomWidth: 1
        },
        headerLeft: () => (
          <View>
            <Image
            source={require('../../assets/logo.png')}
            style={{ width: 35, height: 35, marginHorizontal:7 }}
          />
          </View>
        )
      }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Home color={color} size={size} />
            ),
          }}
        />
        
        <Tab.Screen
          name="Analyse"
          component={Analyse}
          options={{
            tabBarIcon: ({ color, size }) => (
              <BarChart2 color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="MonthlyExpense"
          component={ExpenseManager}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Calendar color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <User color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});