import React, { useState } from 'react';
import { Brain, Languages, Copy, Check, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useMedical } from '../context/MedicalContext';
import { simplifyText, translateText } from '../src/services/api';
import VoicePlayer from './VoicePlayer';

function ResultsPanel() {
  const { state, dispatch } = useMedical();
  const { extractedText, simplifiedText, isProcessing, currentLanguage } = state;
  const [isTranslating, setIsTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState(14); // default font size in pixels

  // Language options matching backend
  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
    { value: 'italian', label: 'Italian' },
    { value: 'portuguese', label: 'Portuguese' },
    { value: 'russian', label: 'Russian' },
    { value: 'chinese', label: 'Chinese (Simplified)' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'korean', label: 'Korean' },
    { value: 'arabic', label: 'Arabic' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'urdu', label: 'Urdu' },
    { value: 'bengali', label: 'Bengali' },
    { value: 'punjabi', label: 'Punjabi' },
    { value: 'turkish', label: 'Turkish' },
    { value: 'vietnamese', label: 'Vietnamese' },
    { value: 'thai', label: 'Thai' },
    { value: 'tagalog', label: 'Tagalog' },
    { value: 'polish', label: 'Polish' },
    { value: 'dutch', label: 'Dutch' },
    { value: 'greek', label: 'Greek' },
    { value: 'khmer', label: 'Khmer' }
  ];

  const handleSimplify = async () => {
    if (!extractedText) return;

    dispatch({ type: 'SET_PROCESSING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await simplifyText(extractedText);
      if (response.success) {
        dispatch({ type: 'SET_SIMPLIFIED_TEXT', payload: response.simplified_text });
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to simplify text' });
      }
    } catch (err) {
      console.error('Simplify error:', err);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: err.response?.data?.detail || 'Failed to simplify text' 
      });
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  };

  const handleLanguageChange = async (newLanguage) => {
    if (!simplifiedText || newLanguage === currentLanguage) return;

    setIsTranslating(true);
    dispatch({ type: 'SET_LANGUAGE', payload: newLanguage });

    try {
      const response = await translateText(simplifiedText, newLanguage);
      if (response.success) {
        dispatch({ type: 'SET_SIMPLIFIED_TEXT', payload: response.translated_text });
      }
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
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
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center space-x-2">
          <Brain className="h-6 w-6 text-primary-600" />
          <span>AI Analysis</span>
        </h2>
        
        {!simplifiedText && (
          <button
            onClick={handleSimplify}
            disabled={isProcessing}
            className="btn-primary flex items-center space-x-2"
          >
            {isProcessing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Brain className="h-4 w-4" />
            )}
            <span>Simplify Diagnosis</span>
          </button>
        )}
      </div>

      {simplifiedText && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Simplified Explanation</h3>
            <div className="flex items-center space-x-3">
              <VoicePlayer text={simplifiedText} />
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
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="prose prose-sm max-w-none">
                <pre 
                  className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {simplifiedText}
                </pre>
              </div>
            </div>
            
            <button
              onClick={() => copyToClipboard(simplifiedText)}
              className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 transition-colors"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      )}

      {extractedText && !simplifiedText && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-700 text-sm">
            💡 Click "Simplify Diagnosis" to get an easy-to-understand explanation of your medical report.
          </p>
        </div>
      )}
    </div>
  );
}

export default ResultsPanel;