require('dotenv').config();
const axios = require('axios');

async function testGemini() {
  try {
    const API_KEY = process.env.GEMINI_API_KEY;
    console.log('API Key loaded:', API_KEY ? 'Yes' : 'No');
    
    if (!API_KEY) {
      throw new Error('No API key found in .env file');
    }

    // Use gemini-2.0-flash (fast and free-tier friendly)
    const modelName = 'gemini-2.0-flash';
    console.log(`Using model: ${modelName}`);
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;
    
    console.log('Sending request to Gemini API...');

    const response = await axios.post(apiUrl, {
      contents: [{
        parts: [{
          text: "Explain photosynthesis in simple terms."
        }]
      }]
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const answer = response.data.candidates[0].content.parts[0].text;

    console.log('✅ Gemini API working!');
    console.log('Response:', answer);
    
  } catch (error) {
    if (error.response?.data?.error?.code === 429) {
      console.log('⏳ Rate limit hit. Wait 1-2 minutes and try again.');
    } else {
      console.error('❌ Error:', error.response?.data || error.message);
    }
  }
}

testGemini();
