import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Switch,
  Alert 
} from 'react-native';
import {
  User,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  ChevronRight,
  LogOut,
  Moon,
  Star,
  Lock,
  CreditCard,
  Wallet
} from 'lucide-react-native';
import { colors } from './Colors';

const ProfileScreen = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Sample user data - in real app, this would come from your auth/state management
  const userData = {
    name: "Ayushman Lakshkar",
    email: "ayushman.lakshkar7@gmail.com",
    phoneNumber: "+91 88715 39009",
    accountType: "Premium",
    kycStatus: "Verified",
    memberSince: "Jan 2024"
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => navigation.replace('Auth')
        }
      ]
    );
  };

  const MenuItem = ({ icon: Icon, title, subtitle = '', onPress, showToggle = false, toggleValue = false, onToggle = () => {} }: { icon: React.ComponentType<{ size: number, color: string }>, title: string, subtitle?: string, onPress?: () => void, showToggle?: boolean, toggleValue?: boolean, onToggle?: (value: boolean) => void }) => (
    <TouchableOpacity 
      style={styles.menuItem}
      onPress={onPress}
      disabled={showToggle}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.iconContainer}>
          <Icon size={20} color="#666" />
        </View>
        <View style={styles.menuItemTextContainer}>
          <Text style={styles.menuItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showToggle ? (
        <Switch 
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={toggleValue ? "#2196F3" : "#f4f3f4"}
        />
      ) : (
        <ChevronRight size={20} color="#666" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.email}>{userData.email}</Text>
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓ KYC Verified</Text>
          </View>
        </View>
      </View>

      {/* Account Summary */}
      <View style={styles.accountSummary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>Premium</Text>
          <Text style={styles.summaryLabel}>Account Type</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>12</Text>
          <Text style={styles.summaryLabel}>Months Active</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>4.8 ★</Text>
          <Text style={styles.summaryLabel}>Rating</Text>
        </View>
      </View>

      {/* Menu Sections */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <MenuItem 
          icon={User} 
          title="Personal Information" 
          subtitle="Manage your personal details"
          onPress={() => navigation.navigate('PersonalInfo')}
        />
        <MenuItem 
          icon={CreditCard} 
          title="Payment Methods" 
          subtitle="Linked cards and accounts"
          onPress={() => navigation.navigate('PaymentMethods')}
        />
        <MenuItem 
          icon={Wallet} 
          title="Spending Limits" 
          subtitle="Set and manage limits"
          onPress={() => navigation.navigate('SpendingLimits')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <MenuItem 
          icon={Bell} 
          title="Notifications" 
          showToggle
          toggleValue={notificationsEnabled}
          onToggle={setNotificationsEnabled}
        />
        <MenuItem 
          icon={Moon} 
          title="Dark Mode" 
          showToggle
          toggleValue={isDarkMode}
          onToggle={setIsDarkMode}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        <MenuItem 
          icon={Lock} 
          title="Change Password"
          onPress={() => navigation.navigate('ChangePassword')}
        />
        <MenuItem 
          icon={Shield} 
          title="Privacy Settings"
          onPress={() => navigation.navigate('PrivacySettings')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <MenuItem 
          icon={HelpCircle} 
          title="Help & Support"
          onPress={() => navigation.navigate('Support')}
        />
        <MenuItem 
          icon={Star} 
          title="Rate Us"
          onPress={() => navigation.navigate('RateUs')}
        />
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color="#FF3B30" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* App Version */}
      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.dark.background,
    },
    header: {
        marginTop:16,
      backgroundColor: colors.dark.secondary,
      padding: 20,
      alignItems: 'center',
    },
    profileImageContainer: {
      marginBottom: 16,
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    editButton: {
      position: 'absolute',
      right: -10,
      bottom: 0,
      backgroundColor: '#2196F3',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 15,
    },
    editButtonText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '600',
    },
    profileInfo: {
      alignItems: 'center',
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 4,
      color: '#fff',
    },
    email: {
      fontSize: 14,
      color: '#ccc',
      marginBottom: 8,
    },
    verifiedBadge: {
      backgroundColor: '#E8F5E9',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    verifiedText: {
      color: '#4CAF50',
      fontSize: 12,
      fontWeight: '600',
    },
    accountSummary: {
      flexDirection: 'row',
      backgroundColor: colors.dark.secondary,
      marginTop: 12,
      padding: 16,
      justifyContent: 'space-between',
    },
    summaryItem: {
      flex: 1,
      alignItems: 'center',
    },
    summaryValue: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
      color: '#fff',
    },
    summaryLabel: {
      fontSize: 12,
      color: '#ccc',
    },
    divider: {
      width: 1,
      backgroundColor: '#444',
    },
    section: {
      backgroundColor: colors.dark.secondary,
      marginTop: 12,
      paddingVertical: 8,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      paddingHorizontal: 16,
      paddingVertical: 8,
      color: '#ccc',
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#444',
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconContainer: {
      width: 36,
      height: 36,
      backgroundColor: '#333',
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    menuItemTextContainer: {
      flex: 1,
    },
    menuItemTitle: {
      fontSize: 16,
      color: '#fff',
    },
    menuItemSubtitle: {
      fontSize: 12,
      color: '#ccc',
      marginTop: 2,
    },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.dark.secondary,
      marginTop: 12,
      padding: 16,
    },
    logoutText: {
      color: '#FF3B30',
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
    versionText: {
      textAlign: 'center',
      color: '#ccc',
      fontSize: 12,
      marginVertical: 16,
    },
  });
  

export default ProfileScreen;