const axios = require('axios');

const API_KEY = process.env.GEMINI_API_KEY;

exports.askGemini = async (req, res) => {
  try {
    const { question, notes } = req.body;

    console.log('📩 Received question:', question);
    console.log('🔑 API Key exists:', !!API_KEY);

    // Validation
    if (!question || question.trim() === '') {
      return res.status(400).json({ message: 'Question is required' });
    }

    // Check if API key is configured
    if (!API_KEY) {
      console.error('❌ No API key found in environment');
      return res.status(500).json({
        message: 'Gemini API key not configured. Please add GEMINI_API_KEY to .env file'
      });
    }

    // Create context with user's notes
    let prompt = `You are NeoLearn AI, a helpful and friendly study assistant for students. Your goal is to help students learn better.\n\n`;

    if (notes && notes.length > 0) {
      prompt += `The student has the following notes:\n\n`;
      notes.slice(0, 5).forEach((note, idx) => {
        prompt += `Note ${idx + 1}: ${note.content}\n`;
      });
      prompt += `\n`;
    }

    prompt += `Student's question: ${question}\n\n`;
    prompt += `Provide a clear, concise, and helpful answer. If the question relates to their notes, reference them. Keep your response friendly and educational.`;

    console.log('📤 Sending request to Gemini API...');

    // Use gemini-2.0-flash (working model)
    const modelName = 'gemini-2.0-flash';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;
    
    const response = await axios.post(apiUrl, {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000 // 30 second timeout
    });

    console.log('✅ Gemini response received successfully');

    // Extract the answer from the response
    const answer = response.data.candidates[0].content.parts[0].text;

    res.json({ answer });
  } catch (error) {
    console.error('❌ Gemini API Error:', error.response?.data || error.message);
    
    let errorMessage = 'Failed to get AI response';
    
    if (error.response) {
      const status = error.response.status;
      if (status === 400) {
        errorMessage = 'Invalid request to Gemini API';
      } else if (status === 403) {
        errorMessage = 'API key permission denied. Check your API key settings';
      } else if (status === 404) {
        errorMessage = 'Model not found. Please check model name';
      } else if (status === 429) {
        errorMessage = 'API rate limit exceeded. Please wait a moment and try again';
      }
    }

    res.status(500).json({
      message: errorMessage,
      error: error.response?.data?.error?.message || error.message
    });
  }
};
