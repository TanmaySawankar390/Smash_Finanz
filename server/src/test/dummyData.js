const mongoose = require('mongoose');
const Transactions = require('../models/Transactions');
const categories = require('../../categories.json');
require('dotenv').config();

// Test user ID (replace with your test user's ID)
const TEST_USER_ID = "67b934580dcd5280e8b17415";

// Sample categories from different domains
const sampleCategoryIds = [
  "5812", // Restaurants
  "5411", // Grocery
  "5541", // Gas/Transportation
  "4900", // Utilities
  "5691", // Clothing
  "8062", // Healthcare
  "7832"  // Entertainment
];

// Generate random amount between min and max
const randomAmount = (min, max) => 
  Math.round((Math.random() * (max - min) + min) * 100) / 100;

// Generate random date within last 30 days
const randomDate = (days = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * days));
  return date;
};

// Generate dummy transactions
const generateTransactions = (count = 50) => {
  const transactions = [];

  for (let i = 0; i < count; i++) {
    const categoryId = sampleCategoryIds[Math.floor(Math.random() * sampleCategoryIds.length)];
    const categoryDetails = categories.find(cat => cat.code === categoryId);

    transactions.push({
      userId: TEST_USER_ID,
      transactionId: `TEST-${Date.now()}-${i}`,
      amount: randomAmount(10, 200),
      categoryDescription: categoryDetails.description,
      categoryId: categoryId,
      categoryName: categoryDetails.category,
      date: randomDate(),
      type: 'expense',
      name: `Test Transaction ${i + 1}`
    });
  }

  return transactions;
};

// Connect and insert data
const insertDummyData = async () => {
  try {
    await mongoose.connect('mongodb+srv://adminsnxt:sanchit@cluster0.q059l.mongodb.net/Codeks');
    console.log('Connected to MongoDB');

    // Clear existing test data
    await Transactions.deleteMany({ userId: TEST_USER_ID });
    console.log('Cleared existing test data');

    // Insert new test data
    const transactions = generateTransactions();
    await Transactions.insertMany(transactions);
    console.log(`Inserted ${transactions.length} test transactions`);

    // Log sample of inserted data
    console.log('\nSample transactions:');
    const sample = await Transactions.find({ userId: TEST_USER_ID }).limit(3);
    console.log(JSON.stringify(sample, null, 2));

    await mongoose.disconnect();
    console.log('\nDone! Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
};

// Run if called directly
if (require.main === module) {
  insertDummyData();
}

module.exports = { generateTransactions, insertDummyData };
