import { useState, useContext } from 'react';
import { LanguageContext } from '../Context/LanguageContext';

export function useTranslate() {
  const { language } = useContext(LanguageContext);
  const [translating, setTranslating] = useState(false);

  const translate = async (text) => {
    if (language === 'en') return text;
    if (!text) return text;

    setTranslating(true);
    try {
      const response = await fetch('https://YOUR_BACKEND_URL/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          targetLang: language
        })
      });

      if (!response.ok) {
        console.error('Translation API error:', response.statusText);
        return text;
      }

      const data = await response.json();
      return data.translatedText || text;
    } catch (error) {
      console.error('Translation failed:', error);
      return text;
    } finally {
      setTranslating(false);
    }
  };

  return { translate, language, translating };
}