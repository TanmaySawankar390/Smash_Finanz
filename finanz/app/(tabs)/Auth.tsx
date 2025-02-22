import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import Auth0 from 'react-native-auth0';
import axios from 'axios';
import { InputField } from '../../components/InputField';
import { SocialButton } from '../../components/SocialButton';
import LottieView from 'lottie-react-native';
import { colors } from './Colors';
import { API_URI } from '@/constants/API';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    // Initialize Auth0
  }, []);

  const saveUserId = async (userId) => {
    try {
      await AsyncStorage.setItem('userId', userId);
      console.log('User ID saved:', userId);
    } catch (error) {
      console.error('Error saving user ID:', error);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);

      if (isLogin) {
        // Log in the user
        // const credentials = await auth0.auth.passwordRealm({
        //   username: email,
        //   password: password,
        //   realm: 'Username-Password-Authentication',
        // });
        const response = await axios.post(`${API_URI}/users/login`,{
          email,
          password
        });
        const userId = response.data.userId;
        await saveUserId(userId);
        // console.log(credentials);
        navigation.replace('Tabs');
      } else {
        // Sign up the user
        console.log('Creating new user...');
        // const response = await axios.post(`https://dev-l4263r2h75x8dbl3.us.auth0.com/dbconnections/signup`, {
        //   client_id: '7R4rmP9yNMyDkowAyiSKnHfx37pXbHfG',
        //   username: email,
        //   email: email,
        //   password: password,
        //   connection: 'Username-Password-Authentication',
        // });

        const response = await axios.post(`${API_URI}/users/register`, {
          email: email,
          password: password,
        })
        console.log(response);
        const userId = response.data.userId;

        await saveUserId(userId);
        console.log('User created:', response.data);

        if (response.data._id) {
          Alert.alert(
            'Account Created',
            'Your account has been created. Please log in.'
          );
          setIsLogin(true);
        } else {
          Alert.alert('Error', response.data.message || 'An error occurred');
        }
      }
    } catch (error) {
      console.error('Error during email authentication:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    // try {
    //   setLoading(true);
    //   const credentials = await auth0.webAuth.authorize({
    //     scope: 'openid profile email',
    //     connection: 'google-oauth2',
    //   });
    //   console.log(credentials);
    //   navigation.replace('Tabs');
    // } catch (error) {
    //   Alert.alert('Error', 'Google sign in failed');
    //   console.error(error);
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    // try {
    //   await auth0.auth.resetPassword({
    //     email: email,
    //     connection: 'Username-Password-Authentication',
    //   });
    //   Alert.alert(
    //     'Password Reset',
    //     'Check your email for password reset instructions'
    //   );
    // } catch (error) {
    //   Alert.alert('Error', 'Failed to send password reset email');
    // }
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../assets/authPage.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
      <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>

      <InputField
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <InputField
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {isLogin && (
        <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotButton}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.mainButton}
        onPress={handleEmailAuth}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.mainButtonText}>
            {isLogin ? 'Login' : 'Sign Up'}
          </Text>
        )}
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>
      <View style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 2 }}>

        <View style={{ alignItems: 'center' }}>
          <SocialButton
            title="Continue with Google"
            onPress={handleGoogleAuth}
            iconName="google"
          />
        </View>


        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => setIsLogin(!isLogin)}
        >
          <Text style={styles.switchText}>
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.dark.background,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: colors.dark.text,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginVertical: 10,
  },
  forgotText: {
    color: '#007AFF',
  },
  mainButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  mainButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 0,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.dark.textSecondary,
  },
  orText: {
    marginHorizontal: 10,
    color: '#666',
  },
  switchButton: {
    marginTop: 20,
  },
  switchText: {
    color: '#007AFF',
    textAlign: 'center',
  },
  lottie: {
    width: 150,
    height: 150,
    alignSelf: 'center',
  }
});

export default AuthScreen;