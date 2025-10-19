import React, { createContext, useContext, useReducer } from 'react';

const MedicalContext = createContext();

const initialState = {
  extractedText: '',
  simplifiedText: '',
  isProcessing: false,
  error: null,
  currentLanguage: 'english',
  chatHistory: []
};

function medicalReducer(state, action) {
  switch (action.type) {
    case 'SET_EXTRACTED_TEXT':
      return { ...state, extractedText: action.payload, error: null };
    case 'SET_SIMPLIFIED_TEXT':
      return { ...state, simplifiedText: action.payload, error: null };
    case 'SET_PROCESSING':
      return { ...state, isProcessing: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isProcessing: false };
    case 'SET_LANGUAGE':
      return { ...state, currentLanguage: action.payload };
    case 'ADD_CHAT_MESSAGE':
      return { 
        ...state, 
        chatHistory: [...state.chatHistory, action.payload] 
      };
    case 'CLEAR_DATA':
      return { 
        ...state, 
        extractedText: '', 
        simplifiedText: '', 
        chatHistory: [],
        error: null 
      };
    case 'SET_CHAT_HISTORY':
      return { ...state, chatHistory: action.payload };
    default:
      return state;
  }
}

export function MedicalProvider({ children }) {
  const [state, dispatch] = useReducer(medicalReducer, initialState);

  return (
    <MedicalContext.Provider value={{ state, dispatch }}>
      {children}
    </MedicalContext.Provider>
  );
}

export function useMedical() {
  const context = useContext(MedicalContext);
  if (!context) {
    throw new Error('useMedical must be used within a MedicalProvider');
  }
  return context;
}
