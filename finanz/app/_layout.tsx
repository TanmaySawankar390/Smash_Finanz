import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { TouchableOpacity, Share } from 'react-native';
import { Share as ShareIcon } from 'lucide-react-native';
import LottieView from 'lottie-react-native';

import AuthScreen from './(tabs)/Auth'; // Import the AuthScreen
import TabsScreen from './(tabs)/TabsScreen'; // Import the TabsScreen
import NotFoundScreen from './+not-found';
import QRScanner from './(tabs)/QRScanner';
import TransactionDetails from './(tabs)/TransactionDetails';
import React from 'react';
import Chatbot from './(tabs)/Chatbot';
import { colors } from './(tabs)/Colors';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#000000',
    primary: '#1E90FF',
    card: '#1E1E1E',
    text: '#FFFFFF',
    border: '#1E1E1E',
  },
};

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out this transaction detail!',
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <ThemeProvider value={CustomDarkTheme}>
            <StatusBar style="light" backgroundColor={colors.dark.background}  />

      <Stack.Navigator>
        <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Tabs" component={TabsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="NotFound" component={NotFoundScreen} />
        <Stack.Screen
          name="TransactionDetail"
          component={TransactionDetails}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Chatbot"
          component={Chatbot}
          options={{
            headerStyle: {
              paddingLeft: 20
            }
          }}
        />
        <Stack.Screen name="QRScanner" component={QRScanner} />
      </Stack.Navigator>
    </ThemeProvider>
  );
}