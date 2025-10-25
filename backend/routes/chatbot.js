const express = require('express');
const { askGemini } = require('../controllers/chatbotController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/ask', auth, askGemini);

module.exports = router;
