import { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get current user and their saved language
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        // Fetch user's saved language preference
        const { data } = await supabase
          .from('user_preferences')
          .select('language')
          .eq('user_id', session.user.id)
          .single();
        if (data?.language) {
          setLanguage(data.language);
        }
      } else {
        setLanguage('en'); // Reset to English if logged out
      }
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
          setLanguage('en'); // Reset language on logout
        }
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  // Save language to Supabase when changed
  const changeLanguage = async (lang) => {
    setLanguage(lang);
    if (user) {
      await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          language: lang,
          updated_at: new Date()
        });
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, loading, user }}>
      {children}
    </LanguageContext.Provider>
  );
}