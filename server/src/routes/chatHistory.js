const express = require('express');
const router = express.Router();
const ChatHistory = require('../models/ChatHistory');
const axios = require('axios');

// Add a message to the database
router.post('/message', async (req, res) => {
  const { userId, type, message } = req.body;

  try {
      const recentMessages = await ChatHistory.find({ userId })
        .sort({ createdAt: -1 })
        .limit(8);
    // Save the user message to the database
    const userMessage = new ChatHistory({ userId, type: 'user', message });
    await userMessage.save();

    // Fetch the recent 8 messages of the user

    // Format the recent messages for the API request
    const formattedMessages = recentMessages.map(msg => `${msg.type}:'${msg.message}'`).join(',');

    // Post the recent messages to an external API
    const apiResponse = await axios.post('https://api.example.com/analyze', {
      history: formattedMessages,
      current: `user:'${message}'`
    });

    // Save the system response to the database
    const systemMessage = new ChatHistory({
      userId,
      type: 'system',
      message: apiResponse.data.response
    });
    await systemMessage.save();

    // Send the system response to the frontend
    res.status(200).json(systemMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;