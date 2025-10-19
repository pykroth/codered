import React, { useState } from 'react';
import { MessageCircle, Send, Bot, User } from 'lucide-react';
import { useMedical } from '../context/MedicalContext';
import { askQuestion } from '../src/services/api';
import VoicePlayer from './VoicePlayer';

function QASection() {
  const { state, dispatch } = useMedical();
  const { extractedText, simplifiedText, chatHistory } = state;
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || !extractedText) return;

    setIsAsking(true);
    
    // Add user question to chat history
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: question,
      timestamp: new Date()
    };
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMessage });

    try {
      const context = simplifiedText || extractedText;
      const response = await askQuestion(question, context);
      
      if (response.success) {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: response.answer,
          timestamp: new Date()
        };
        dispatch({ type: 'ADD_CHAT_MESSAGE', payload: botMessage });
      }
    } catch (err) {
      console.error('Q&A error:', err);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: errorMessage });
    } finally {
      setIsAsking(false);
      setQuestion('');
    }
  };

  if (!extractedText) {
    return null;
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-6">
        <MessageCircle className="h-6 w-6 text-primary-600" />
        <h2 className="text-2xl font-semibold text-gray-900">Ask Questions</h2>
      </div>

      <div className="mb-6">
        <p className="text-gray-600 text-sm">
          Have questions about your medical report? Ask me anything and I'll help explain it in simple terms.
        </p>
      </div>

      {/* Chat History */}
      {chatHistory.length > 0 && (
        <div className="mb-6 max-h-96 overflow-y-auto space-y-4">
          {chatHistory.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.type === 'bot' && (
                    <Bot className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
                  )}
                  {message.type === 'user' && (
                    <User className="h-4 w-4 mt-0.5 text-white flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className={`text-xs ${
                        message.type === 'user' ? 'text-primary-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                      {message.type === 'bot' && (
                        <VoicePlayer 
                          text={message.content} 
                          className="ml-2"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Question Input */}
      <form onSubmit={handleSubmit} className="flex space-x-3">
        <div className="flex-1">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about your medical report..."
            className="input-field"
            disabled={isAsking}
          />
        </div>
        <button
          type="submit"
          disabled={!question.trim() || isAsking}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAsking ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span>Ask</span>
        </button>
      </form>

      {/* Example Questions */}
      {chatHistory.length === 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "What does this diagnosis mean?",
              "Are there any side effects I should know about?",
              "What should I do next?",
              "Is this condition serious?"
            ].map((example, index) => (
              <button
                key={index}
                onClick={() => setQuestion(example)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default QASection;
