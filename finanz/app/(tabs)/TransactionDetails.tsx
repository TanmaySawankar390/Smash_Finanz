import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { Copy, Share as ShareIcon, ArrowLeft, CheckCircle } from 'lucide-react-native';

const TransactionDetails = ({ navigation, route }) => {
  // Sample transaction data - in real app, this would come from route.params
  const transaction = {
    id: "TXN123456789",
    status: "SUCCESS",
    amount: 1299.00,
    currency: "INR",
    type: "UPI Payment",
    date: "2024-02-21T14:30:00",
    referenceId: "REF987654321",
    upiId: "user@okbank",
    merchantName: "Amazon Shopping",
    description: "Online Purchase - Order #ODR123456",
    bankAccount: {
      number: "XXXXXXXX1234",
      ifsc: "SBIN0001234",
      name: "State Bank of India"
    }
  };

  // Function to copy text to clipboard
  const copyToClipboard = (text) => {
    // In real app, implement actual clipboard functionality
    console.log('Copied:', text);
  };

  // Function to share transaction details
  const shareTransaction = async () => {
    try {
      await Share.share({
        message: `Transaction Details\nID: ${transaction.id}\nAmount: ₹${transaction.amount}\nDate: ${new Date(transaction.date).toLocaleString()}`
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction Details</Text>
        <TouchableOpacity onPress={shareTransaction}>
          <ShareIcon size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Status and Amount Section */}
        <View style={styles.amountContainer}>
          <View style={styles.statusContainer}>
            <CheckCircle size={24} color="#4CAF50" />
            <Text style={styles.statusText}>{transaction.status}</Text>
          </View>
          <Text style={styles.amountText}>₹{transaction.amount.toFixed(2)}</Text>
          <Text style={styles.dateText}>{formatDate(transaction.date)}</Text>
        </View>

        {/* Transaction Details Section */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Transaction Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction ID</Text>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>{transaction.id}</Text>
              <TouchableOpacity onPress={() => copyToClipboard(transaction.id)}>
                <Copy size={16} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Reference ID</Text>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>{transaction.referenceId}</Text>
              <TouchableOpacity onPress={() => copyToClipboard(transaction.referenceId)}>
                <Copy size={16} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Type</Text>
            <Text style={styles.detailValue}>{transaction.type}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Description</Text>
            <Text style={styles.detailValue}>{transaction.description}</Text>
          </View>
        </View>

        {/* Payment Details Section */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Payment Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Merchant</Text>
            <Text style={styles.detailValue}>{transaction.merchantName}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>UPI ID</Text>
            <Text style={styles.detailValue}>{transaction.upiId}</Text>
          </View>
        </View>

        {/* Bank Details Section */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Bank Account Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Account Number</Text>
            <Text style={styles.detailValue}>{transaction.bankAccount.number}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>IFSC Code</Text>
            <Text style={styles.detailValue}>{transaction.bankAccount.ifsc}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Bank Name</Text>
            <Text style={styles.detailValue}>{transaction.bankAccount.name}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  amountContainer: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    marginLeft: 8,
    color: '#4CAF50',
    fontWeight: '600',
  },
  amountText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  dateText: {
    color: '#666',
    fontSize: 14,
  },
  detailsCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailLabel: {
    color: '#666',
    fontSize: 14,
  },
  detailValue: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  detailValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default TransactionDetails;