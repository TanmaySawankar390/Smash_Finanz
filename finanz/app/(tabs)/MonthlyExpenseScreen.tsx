import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  Switch
} from 'react-native';
import { Trash2, Edit2, Plus, Bell, ChevronDown } from 'lucide-react-native';
import { colors } from './Colors';
import NotificationService from './NotificationService';

const ExpenseManager = () => {
  const [expenses, setExpenses] = useState([
    {
      id: '1',
      name: 'Netflix Subscription',
      description: 'Monthly streaming service',
      category: 'Entertainment',
      amount: 199,
      dueDate: new Date(),
      notificationEnabled: true
    }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    amount: 0,
    dueDate: new Date(),
    notificationEnabled: false
  });

  const categories = [
    'Bills', 'Entertainment', 'Food', 
    'Transportation', 'Shopping', 'Health',
    'Education', 'Others'
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      amount: 0,
      dueDate: new Date(),
      notificationEnabled: false
    });
    setEditingId(null);
  };

  const handleAddExpense = async () => {
    if (!formData.name || !formData.category || !formData.amount) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    const newExpense = { ...formData, id: editingId || Date.now().toString() };

    if (editingId) {
        setExpenses(expenses.map(expense => 
          expense.id === editingId ? newExpense : expense
        ));
      } else {
        setExpenses([...expenses, newExpense]);
      }
    await NotificationService.testNotification()
    if (newExpense.notificationEnabled) {
        await NotificationService.scheduleMonthlyExpenseNotification(newExpense);
      }
    
      // Check category limits
      await NotificationService.checkCategoryLimit(newExpense);
      await NotificationService.updateMonthlyExpenses(newExpense);

    setModalVisible(false);
    resetForm();
  };

  const handleEditExpense = (expense) => {
    setEditingId(expense.id);
    setFormData(expense);
    setModalVisible(true);
  };

  const handleDeleteExpense = (id) => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: () => setExpenses(expenses.filter(expense => expense.id !== id)),
          style: 'destructive'
        }
      ]
    );
  };

  const ExpenseCard = ({ item }) => (
    <View style={styles.expenseCard}>
      <View style={styles.expenseHeader}>
        <View>
          <Text style={styles.expenseName}>{item.name}</Text>
          <Text style={styles.expenseCategory}>{item.category}</Text>
        </View>
        <Text style={styles.expenseAmount}>₹{item.amount}</Text>
      </View>

      {item.description && (
        <Text style={styles.expenseDescription}>{item.description}</Text>
      )}

      <View style={styles.expenseFooter}>
        <View style={styles.expenseDueDate}>
          <Text style={styles.dueDateText}>
            Due: {item.dueDate.toLocaleDateString()}
          </Text>
          {item.notificationEnabled && <Bell size={16} color="#4CAF50" />}
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            onPress={() => handleEditExpense(item)}
            style={[styles.actionButton, styles.editButton]}
          >
            <Edit2 size={16} color="#2196F3" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => handleDeleteExpense(item.id)}
            style={[styles.actionButton, styles.deleteButton]}
          >
            <Trash2 size={16} color="#FF5252" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={expenses}
        renderItem={({ item }) => <ExpenseCard item={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity 
        style={styles.addButton}
        onPress={async() => {
        //   resetForm();
        //   setModalVisible(true);
        await NotificationService.testNotification()

        }}
      >
        <Plus size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {editingId ? 'Edit Expense' : 'Add New Expense'}
          </Text>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.inputLabel}>Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
              placeholder="Enter expense name"
            />

            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData({...formData, description: text})}
              placeholder="Enter description (optional)"
              multiline
              numberOfLines={3}
            />

            <Text style={styles.inputLabel}>Category *</Text>
            <TouchableOpacity
              style={styles.categorySelector}
              onPress={() => setShowCategoryPicker(!showCategoryPicker)}
            >
              <Text>{formData.category || 'Select category'}</Text>
              <ChevronDown size={20} color="#666" />
            </TouchableOpacity>

            {showCategoryPicker && (
              <View style={styles.categoryList}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={styles.categoryItem}
                    onPress={() => {
                      setFormData({...formData, category});
                      setShowCategoryPicker(false);
                    }}
                  >
                    <Text style={styles.categoryText}>{category}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={styles.inputLabel}>Amount *</Text>
            <TextInput
              style={styles.input}
              value={formData.amount.toString()}
              onChangeText={(text) => setFormData({...formData, amount: Number(text)})}
              keyboardType="numeric"
              placeholder="Enter amount"
            />

            <Text style={styles.inputLabel}>Due Date</Text>
            <TouchableOpacity
              style={styles.dateSelector}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{formData.dueDate.toLocaleDateString()}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={formData.dueDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setFormData({...formData, dueDate: selectedDate});
                  }
                }}
              />
            )}

            <View style={styles.notificationContainer}>
              <Text style={styles.inputLabel}>Enable Notifications</Text>
              <Switch
                value={formData.notificationEnabled}
                onValueChange={(value) => 
                  setFormData({...formData, notificationEnabled: value})
                }
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={formData.notificationEnabled ? "#2196F3" : "#f4f3f4"}
              />
            </View>
          </ScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => {
                setModalVisible(false);
                resetForm();
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleAddExpense}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.background,
  },
  list: {
    padding: 16,
  },
  expenseCard: {
    backgroundColor: colors.dark.secondary,
    borderWidth:1,
    borderColor:colors.dark.border,
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    color:colors.dark.text
  },
  expenseName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark.text,
  },
  expenseCategory: {
    color: '#666',
    marginTop: 4,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark.error,
  },
  expenseDescription: {
    marginTop: 8,
    color: '#666',
  },
  expenseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
  expenseDueDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dueDateText: {
    color: 'white',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
  },
  editButton: {
    backgroundColor: '#E3F2FD',
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 30,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalContent: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categorySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  categoryList: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
  },
  categoryItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryText: {
    fontSize: 16,
  },
  dateSelector: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  notificationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    marginRight: 8,
    backgroundColor: '#f5f5f5',
  },
  saveButton: {
    marginLeft: 8,
    backgroundColor: '#2196F3',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ExpenseManager;