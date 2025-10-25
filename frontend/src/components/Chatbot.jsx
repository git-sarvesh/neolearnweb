import React, { useState } from 'react';

export default function Chatbot({ token, notes }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { type: 'user', text: query }]);
    setLoading(true);

    try {
      console.log('🚀 Sending request to:', 'http://localhost:5000/api/chatbot/ask');
      console.log('📝 Question:', query);
      console.log('🔑 Token:', token ? 'Present' : 'Missing');
      
      const res = await fetch('http://localhost:5000/api/chatbot/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          question: query,
          notes: notes || [] 
        }),
      });

      console.log('📡 Response status:', res.status);
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error('❌ Error response:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('✅ Response data:', data);
      
      if (data.answer) {
        setMessages((prev) => [...prev, { type: 'bot', text: data.answer }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { type: 'bot', text: data.message || 'Sorry, I could not get a response.' },
        ]);
      }
    } catch (error) {
      console.error('❌ Chatbot error:', error);
      setMessages((prev) => [
        ...prev,
        { type: 'bot', text: `Error: ${error.message}` },
      ]);
    }

    setLoading(false);
    setQuery('');
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <span>🤖 Chatbot Assistant (Powered by Gemini AI)</span>
      </div>
      <div className="chatbot-messages">
        <p className="chatbot-intro">
          Hello! I can summarize your notes or answer study questions using AI
        </p>
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.type}`}>
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="message bot">
            <em>AI is thinking...</em>
          </div>
        )}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          placeholder="Ask anything about your studies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !loading && handleAsk()}
          disabled={loading}
        />
        <button onClick={handleAsk} disabled={loading}>
          {loading ? 'Asking...' : 'Ask'}
        </button>
      </div>
    </div>
  );
}
