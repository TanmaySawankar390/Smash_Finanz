import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { Wallet, TrendingUp, TrendingDown, Plus, QrCode, MessageCircle } from 'lucide-react-native';

import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import { colors } from './Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URI } from '@/constants/API';

const HomeScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
    // Sample data - replace with your actual data
    const [balance, setBalance] = useState(0);
    const [todaySpent, setTodaySpent] = useState(0);
    const [transactions, setTransactions] = useState([]);
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => navigation.navigate('QRScanner')}
                    style={styles.headerButton}
                >
                    <QrCode color="#007AFF" size={24} />
                </TouchableOpacity>
            ),
            headerTitle: 'Money Manager',
            headerTitleStyle: styles.headerTitle,
        });
    }, [navigation]);
    const fetchUserData = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            if (userId) {
                const response = await axios.post(`${API_URI}/users/profile`, {
                    userId: userId
                });
                setBalance(response.data.balance);
                const transactions = await axios.get(`${API_URI}/transactions/allTransaction?userId=${userId}`);
                setTransactions(transactions.data);

                const today = new Date();
                const todayDateString = today.toISOString().split("T")[0]; // Format as YYYY-MM-DD

                const todayTransaction = transactions.data.filter(transaction => {
                    const transactionDate = new Date(transaction.createdAt).toISOString().split("T")[0];
                    return transactionDate === todayDateString;
                });

                const todaySpent = todayTransaction
                    .filter(transaction => transaction.type === 'expense')
                    .reduce((total, transaction) => total + transaction.amount, 0);
                
                setTodaySpent(todaySpent);

            } else {
                console.log('No user ID found in AsyncStorage');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };
    
    useFocusEffect(
        useCallback(() => {
            fetchUserData();
        }, [])
    );

    const formatCurrency = (amount: number) => {
        return `$${Math.abs(amount).toFixed(2)}`;
    };
    const formatTransactionTime = (time: string) => {
        const date = new Date(time);
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 1) {
            return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        } else if (days === 1) {
            return `Yesterday ${date.toLocaleTimeString()}`;
        } else if (hours >= 1) {
            return `${hours} hours ago`;
        } else if (minutes >= 1) {
            return `${minutes} minutes ago`;
        } else {
            return 'Just now';
        }
    };
    const renderTransactionItem = (transaction) => {
        const isExpense = transaction.type === 'expense';

        return (
            <TouchableOpacity
                key={transaction._id}
                style={styles.transactionItem}
                onPress={() => navigation.navigate('TransactionDetail', { transaction })}
            >
                <View style={styles.transactionIcon}>
                    {isExpense ? (
                        <TrendingDown color="#FF4444" size={24} />
                    ) : (
                        <TrendingUp color="#00C851" size={24} />
                    )}
                </View>

                <View style={styles.transactionInfo}>
                    <Text style={styles.transactionTitle}>{transaction.categoryDescription}</Text>
                    <Text style={styles.transactionCategory}>{transaction.categoryName}</Text>
                </View>

                <View style={styles.transactionAmount}>
                    <Text style={[
                        styles.amount,
                        { color: isExpense ? '#FF4444' : '#00C851' }
                    ]}>
                        {isExpense ? '-' : '+'}{formatCurrency(transaction.amount)}
                    </Text>
                    <Text style={styles.transactionTime}>{formatTransactionTime(transaction.time)}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const handleChatPress = () => {
        navigation.navigate('Chatbot');
    };
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {/* Header */}
                {/* <View style={styles.header}>
          <Text style={styles.greeting}>Hello, John</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <View style={styles.profileButton}>
              <Text style={styles.profileInitial}>J</Text>
            </View>
          </TouchableOpacity>
        </View> */}

                {/* Balance Card */}
                <View style={styles.balanceCard}>
                    <View style={styles.balanceHeader}>
                        <Wallet color="#fff" size={24} />
                        <Text style={styles.balanceTitle}>Total Balance</Text>
                    </View>
                    <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
                    <View style={styles.todaySpent}>
                        <Text style={styles.todaySpentText}>
                            Today's Spending Today: {formatCurrency(todaySpent)}
                        </Text>
                    </View>
                </View>

                {/* Quick Actions */}
                {/* <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => navigation.navigate('AddTransaction')}
          >
            <Plus color="#fff" size={24} />
            <Text style={styles.addButtonText}>Add Transaction</Text>
          </TouchableOpacity>
        </View> */}

                {/* Recent Transactions */}
                <View style={styles.transactionsContainer}>
                    <Text style={styles.sectionTitle}>Recent Transactions</Text>
                    <View style={styles.transactionsList}>
                    {transactions?.slice().reverse().map(renderTransactionItem)}
                    </View>
                </View>
            </ScrollView>
            <TouchableOpacity
                style={styles.chatButton}
                onPress={handleChatPress}
            >
                <MessageCircle color="#fff" size={24} />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark.background,
    },
    chatButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.dark.text,
    },
    profileButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileInitial: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    balanceCard: {
        backgroundColor: colors.dark.secondary,
        borderColor: colors.dark.border,
        borderWidth: 1,
        margin: 20,
        borderRadius: 20,
        padding: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    balanceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    balanceTitle: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 10,
    },
    balanceAmount: {
        color: '#fff',
        fontSize: 36,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    todaySpent: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
    },
    todaySpentText: {
        color: '#fff',
        fontSize: 14,
    },
    quickActions: {
        padding: 20,
    },
    addButton: {
        backgroundColor: '#00C851',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },
    transactionsContainer: {
        padding: 20,

    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: colors.dark.text,
    },
    transactionsList: {
        backgroundColor: colors.dark.secondary,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.dark.border,
        overflow: 'hidden',
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.dark.border,
    },
    transactionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f8f8f8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    transactionInfo: {
        flex: 1,
        marginLeft: 15,
    },
    transactionTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.dark.text,
    },
    transactionCategory: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    transactionAmount: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: 16,
        fontWeight: '600',
    },
    transactionTime: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
});
export default HomeScreen;