const express = require('express');
const router = express.Router();
const Transactions = require('../models/Transactions');
const User = require('../models/User'); // Add this import
const categories = require('../../categories.json');

// GET route to fetch specific transaction
router.get('/', async (req, res) => {
    try {

        const transaction = await Transactions.findOne({
            userId: userId,
            transactionId: transactionId
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transaction', error: error.message });
    }
});

// POST route to create new transaction
router.post('/', async (req, res) => {
    try {
        const { userId, pn, amount, mc } = req.body;

        console.log("transactionData", req.body);

        // Find category description
        const categoryDetails = categories.find(cat => cat.code === mc);
        if (!categoryDetails) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }
        console.log("categoryDetails", categoryDetails);

        // Create new transaction with category details
        const newTransaction = new Transactions({
            userId:userId,
            transactionId: Math.random().toString(36).substr(2, 9),
            name: pn,
            type: 'expense',
            amount,
            categoryId: mc,
            categoryDescription: categoryDetails.description,
            categoryName: categoryDetails.category,
            date: new Date() // added required date
        });
        console.log("newTransaction", newTransaction);
        const savedTransaction = await newTransaction.save();
        // Update user's amount by subtracting the transaction amount
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.balance -= amount;
        await user.save();
        console.log("savedTransaction", savedTransaction);
        res.status(201).json(savedTransaction);
    } catch (error) {
        res.status(500).json({ message: 'Error creating transaction', error: error.message });
    }
});

router.get('/allTransaction', async (req, res) => {
    try {
        const { userId } = req.query;

        const transactions = await Transactions.find({ userId });

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transactions', error: error.message });
    }
})

module.exports = router;