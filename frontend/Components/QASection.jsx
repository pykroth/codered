import React, { useState } from 'react';
import { MessageCircle, Send, Bot, User, ZoomIn, ZoomOut, RotateCcw, Languages } from 'lucide-react';
import { useMedical } from '../context/MedicalContext';
import { askQuestion, translateText } from '../src/services/api';
import VoicePlayer from './VoicePlayer';

function QASection() {
  const { state, dispatch } = useMedical();
  const { extractedText, simplifiedText, chatHistory } = state;
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [fontSize, setFontSize] = useState(14); // default font size in pixels
  const [currentLanguage, setCurrentLanguage] = useState('english');
  const [isTranslating, setIsTranslating] = useState(false);

  // Language options matching backend
  const languageOptions = [
    { value: 'arabic', label: 'Arabic' },
    { value: 'bengali', label: 'Bengali' },
    { value: 'chinese', label: 'Chinese (Simplified)' },
    { value: 'dutch', label: 'Dutch' },
    { value: 'english', label: 'English' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
    { value: 'greek', label: 'Greek' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'italian', label: 'Italian' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'khmer', label: 'Khmer' },
    { value: 'korean', label: 'Korean' },
    { value: 'polish', label: 'Polish' },
    { value: 'portuguese', label: 'Portuguese' },
    { value: 'punjabi', label: 'Punjabi' },
    { value: 'russian', label: 'Russian' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'tagalog', label: 'Tagalog' },
    { value: 'thai', label: 'Thai' },
    { value: 'turkish', label: 'Turkish' },
    { value: 'urdu', label: 'Urdu' },
    { value: 'vietnamese', label: 'Vietnamese' }
  ];

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

  const handleLanguageChange = async (newLanguage) => {
    if (chatHistory.length === 0 || newLanguage === currentLanguage) return;

    setIsTranslating(true);
    setCurrentLanguage(newLanguage);

    try {
      // Translate all bot messages in chat history
      const translatedHistory = await Promise.all(
        chatHistory.map(async (message) => {
          if (message.type === 'bot') {
            const response = await translateText(message.content, newLanguage);
            if (response.success) {
              return {
                ...message,
                content: response.translated_text
              };
            }
          }
          return message;
        })
      );
      
      dispatch({ type: 'SET_CHAT_HISTORY', payload: translatedHistory });
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24)); // max 24px
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 10)); // min 10px
  };

  const resetFontSize = () => {
    setFontSize(14); // reset to default
  };

  if (!extractedText) {
    return null;
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-6 w-6 text-primary-600" />
          <h2 className="text-2xl font-semibold text-gray-900">Ask Questions</h2>
        </div>
  
        <div className="flex items-center space-x-3">
          {/* Text Size Controls */}
          <div className="flex items-center space-x-1 border border-gray-300 rounded px-2 py-1">
            <button
              onClick={decreaseFontSize}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Decrease text size"
            >
              <ZoomOut className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={resetFontSize}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Reset text size"
            >
              <RotateCcw className="h-3 w-3 text-gray-600" />
            </button>
            <button
              onClick={increaseFontSize}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Increase text size"
            >
              <ZoomIn className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          
          {/* Language Selector */}
          {chatHistory.length > 0 && (
            <div className="flex items-center space-x-2">
              <Languages className="h-4 w-4 text-gray-500" />
              <select
                value={currentLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                disabled={isTranslating}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                {languageOptions.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
              {isTranslating && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
              )}
            </div>
          )}
        </div>
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
                    <p 
                      className="whitespace-pre-wrap"
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      {message.content}
                    </p>
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
// import React, { useState } from 'react';
// import { MessageCircle, Send, Bot, User, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
// import { useMedical } from '../context/MedicalContext';
// import { askQuestion } from '../src/services/api';
// import VoicePlayer from './VoicePlayer';

// function QASection() {
//   const { state, dispatch } = useMedical();
//   const { extractedText, simplifiedText, chatHistory } = state;
//   const [question, setQuestion] = useState('');
//   const [isAsking, setIsAsking] = useState(false);
//   const [fontSize, setFontSize] = useState(14); // default font size in pixels

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!question.trim() || !extractedText) return;

//     setIsAsking(true);
    
//     // Add user question to chat history
//     const userMessage = {
//       id: Date.now(),
//       type: 'user',
//       content: question,
//       timestamp: new Date()
//     };
//     dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMessage });

//     try {
//       const context = simplifiedText || extractedText;
//       const response = await askQuestion(question, context);
      
//       if (response.success) {
//         const botMessage = {
//           id: Date.now() + 1,
//           type: 'bot',
//           content: response.answer,
//           timestamp: new Date()
//         };
//         dispatch({ type: 'ADD_CHAT_MESSAGE', payload: botMessage });
//       }
//     } catch (err) {
//       console.error('Q&A error:', err);
//       const errorMessage = {
//         id: Date.now() + 1,
//         type: 'bot',
//         content: 'Sorry, I encountered an error. Please try again.',
//         timestamp: new Date()
//       };
//       dispatch({ type: 'ADD_CHAT_MESSAGE', payload: errorMessage });
//     } finally {
//       setIsAsking(false);
//       setQuestion('');
//     }
//   };

//   const increaseFontSize = () => {
//     setFontSize(prev => Math.min(prev + 2, 24)); // max 24px
//   };

//   const decreaseFontSize = () => {
//     setFontSize(prev => Math.max(prev - 2, 10)); // min 10px
//   };

//   const resetFontSize = () => {
//     setFontSize(14); // reset to default
//   };

//   if (!extractedText) {
//     return null;
//   }

//   return (
//     <div className="card">
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center space-x-2">
//           <MessageCircle className="h-6 w-6 text-primary-600" />
//           <h2 className="text-2xl font-semibold text-gray-900">Ask Questions</h2>
//         </div>
  
//         {/* Text Size Controls */}
//         <div className="flex items-center space-x-1 border border-gray-300 rounded px-2 py-1">
//           <button
//             onClick={decreaseFontSize}
//             className="p-1 hover:bg-gray-100 rounded transition-colors"
//             title="Decrease text size"
//           >
//             <ZoomOut className="h-4 w-4 text-gray-600" />
//           </button>
//           <button
//             onClick={resetFontSize}
//             className="p-1 hover:bg-gray-100 rounded transition-colors"
//             title="Reset text size"
//           >
//             <RotateCcw className="h-3 w-3 text-gray-600" />
//           </button>
//           <button
//             onClick={increaseFontSize}
//             className="p-1 hover:bg-gray-100 rounded transition-colors"
//             title="Increase text size"
//           >
//             <ZoomIn className="h-4 w-4 text-gray-600" />
//           </button>
//         </div>
//       </div>

//       <div className="mb-6">
//         <p className="text-gray-600 text-sm">
//           Have questions about your medical report? Ask me anything and I'll help explain it in simple terms.
//         </p>
//       </div>

//       {/* Chat History */}
//       {chatHistory.length > 0 && (
//         <div className="mb-6 max-h-96 overflow-y-auto space-y-4">
//           {chatHistory.map((message) => (
//             <div
//               key={message.id}
//               className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
//             >
//               <div
//                 className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
//                   message.type === 'user'
//                     ? 'bg-primary-600 text-white'
//                     : 'bg-gray-100 text-gray-800'
//                 }`}
//               >
//                 <div className="flex items-start space-x-2">
//                   {message.type === 'bot' && (
//                     <Bot className="h-4 w-4 mt-0.5 text-gray-500 flex-shrink-0" />
//                   )}
//                   {message.type === 'user' && (
//                     <User className="h-4 w-4 mt-0.5 text-white flex-shrink-0" />
//                   )}
//                   <div className="flex-1">
//                     <p 
//                       className="whitespace-pre-wrap"
//                       style={{ fontSize: `${fontSize}px` }}
//                     >
//                       {message.content}
//                     </p>
//                     <div className="flex items-center justify-between mt-1">
//                       <p className={`text-xs ${
//                         message.type === 'user' ? 'text-primary-100' : 'text-gray-500'
//                       }`}>
//                         {message.timestamp.toLocaleTimeString()}
//                       </p>
//                       {message.type === 'bot' && (
//                         <VoicePlayer 
//                           text={message.content} 
//                           className="ml-2"
//                         />
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Question Input */}
//       <form onSubmit={handleSubmit} className="flex space-x-3">
//         <div className="flex-1">
//           <input
//             type="text"
//             value={question}
//             onChange={(e) => setQuestion(e.target.value)}
//             placeholder="Ask a question about your medical report..."
//             className="input-field"
//             disabled={isAsking}
//           />
//         </div>
//         <button
//           type="submit"
//           disabled={!question.trim() || isAsking}
//           className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {isAsking ? (
//             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//           ) : (
//             <Send className="h-4 w-4" />
//           )}
//           <span>Ask</span>
//         </button>
//       </form>

//       {/* Example Questions */}
//       {chatHistory.length === 0 && (
//         <div className="mt-4">
//           <p className="text-sm text-gray-500 mb-2">Try asking:</p>
//           <div className="flex flex-wrap gap-2">
//             {[
//               "What does this diagnosis mean?",
//               "Are there any side effects I should know about?",
//               "What should I do next?",
//               "Is this condition serious?"
//             ].map((example, index) => (
//               <button
//                 key={index}
//                 onClick={() => setQuestion(example)}
//                 className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
//               >
//                 {example}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default QASection;
