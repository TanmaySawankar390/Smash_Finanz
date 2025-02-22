const express = require('express');
const router = express.Router();
const Transactions = require('../models/Transactions');
const categories = require('../../categories.json');

// Get total spending by category
router.get('/category-total/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const userId = req.body.userId;

    // Get all categoryIds for the specified category
    const categoryIds = categories
      .filter(cat => cat.category.toLowerCase() === category.toLowerCase())
      .map(cat => cat.code);

    if (categoryIds.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const total = await Transactions.aggregate([
      {
        $match: {
          categoryId: { $in: categoryIds },
          userId: userId,
          type: 'expense'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    res.json({
      category,
      categoryIds,
      total: total.length > 0 ? total[0].total : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get spending trends across categories
router.get('/trends', async (req, res) => {
  try {

    const {userId, timeperiod, startDate: customStartDate, endDate: customEndDate } = req.query;
    
    let startDate, endDate;
    
    // Handle different date range scenarios
    if (customStartDate && customEndDate) {
      // Case 1: Custom date range
      startDate = new Date(customStartDate);
      endDate = new Date(customEndDate);
    } else if (timeperiod) {
      // Case 2: Past n days
      endDate = new Date();
      startDate = new Date();
      startDate.setDate(endDate.getDate() - parseInt(timeperiod));
    } else {
      // Case 3: Default to last 7 days
      endDate = new Date();
      startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);
    }

    const trends = await Transactions.aggregate([
      {
        $match: {
          userId: userId,
          date: { 
            $gte: startDate,
            $lte: endDate 
          },
          type: 'expense'
        }
      },
      {
        $addFields: {
          categoryInfo: {
            $arrayElemAt: [{
              $filter: {
                input: categories,
                as: "cat",
                cond: { $eq: ["$$cat.code", "$categoryId"] }
              }
            }, 0]
          }
        }
      },
      {
        $group: {
          _id: {
            category: "$categoryInfo.category",
            date: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$date"
              }
            }
          },
          dailyTotal: { $sum: "$amount" }
        }
      },
      {
        $group: {
          _id: "$_id.category",
          dailySpends: {
            $push: {
              date: "$_id.date",
              amount: "$dailyTotal"
            }
          },
          totalSpend: { $sum: "$dailyTotal" }
        }
      },
      {
        $match: {
          _id: { $ne: null }
        }
      },
      {
        $sort: { totalSpend: -1 }
      }
    ]);

    res.json({
      timeframe: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        days: Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
      },
      trends: trends
    });
  } catch (error) {
    console.error('Trends Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get spending distribution across all categories
router.get('/category-distribution', async (req, res) => {
  try {
    const {userId} = req.query;
    const { startDate, endDate } = req.query;

    const matchQuery = {
      userId: userId,
      type: 'expense'
    };

    if (startDate && endDate) {
      matchQuery.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Get spending data with proper category mapping
    const distribution = await Transactions.aggregate([
      {
        $match: matchQuery
      },
      {
        $addFields: {
          // Find matching category from categories array
          categoryInfo: {
            $arrayElemAt: [{
              $filter: {
                input: categories,
                as: "cat",
                cond: { $eq: ["$$cat.code", "$categoryId"] }
              }
            }, 0]
          }
        }
      },
      {
        $group: {
          _id: "$categoryInfo.category",
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          transactions: { 
            $push: { 
              amount: '$amount', 
              date: '$date',
              categoryId: '$categoryId',
              description: '$description'
            } 
          }
        }
      },
      {
        $match: {
          _id: { $ne: null } // Filter out transactions with no category match
        }
      }
    ]);

    const totalSpending = distribution.reduce((sum, cat) => sum + cat.totalAmount, 0);

    // Create an object with only categories that have transactions
    const categoryData = distribution.reduce((acc, category) => {
      if (category._id && category.totalAmount > 0) {
        acc[category._id] = {
          totalAmount: category.totalAmount,
          count: category.count,
          percentage: ((category.totalAmount / totalSpending) * 100).toFixed(2),
          transactions: category.transactions,
          categoryIds: categories
            .filter(cat => cat.category === category._id)
            .map(cat => cat.code)
        };
      }
      return acc;
    }, {});

    res.json({
      total: totalSpending,
      categoriesCount: Object.keys(categoryData).length,
      categories: categoryData
    });
  } catch (error) {
    console.error('Category Distribution Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
