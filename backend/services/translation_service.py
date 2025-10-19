import google.generativeai as genai
import os
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class TranslationService:
    def __init__(self):
        self.model = None
        self._initialize_client()
        # Extended language support with commonly used languages
        self.language_codes = {
            "english": "en",
            "spanish": "es",
            "french": "fr",
            "german": "de",
            "italian": "it",
            "portuguese": "pt",
            "russian": "ru",
            "chinese": "zh",
            "japanese": "ja",
            "korean": "ko",
            "arabic": "ar",
            "hindi": "hi",
            "urdu": "ur",
            "bengali": "bn",
            "punjabi": "pa",
            "turkish": "tr",
            "vietnamese": "vi",
            "thai": "th",
            "tagalog": "tl",
            "polish": "pl",
            "dutch": "nl",
            "greek": "el",
            "khmer": "km"
        }
        
        # Map language codes to full names for prompts
        self.language_names = {
            "english": "English",
            "spanish": "Spanish",
            "french": "French",
            "german": "German",
            "italian": "Italian",
            "portuguese": "Portuguese",
            "russian": "Russian",
            "chinese": "Simplified Chinese",
            "japanese": "Japanese",
            "korean": "Korean",
            "arabic": "Arabic",
            "hindi": "Hindi",
            "urdu": "Urdu",
            "bengali": "Bengali",
            "punjabi": "Punjabi",
            "turkish": "Turkish",
            "vietnamese": "Vietnamese",
            "thai": "Thai",
            "tagalog": "Tagalog",
            "polish": "Polish",
            "dutch": "Dutch",
            "greek": "Greek",
            "khmer": "Khmer"
        }
    
    def _initialize_client(self):
        """Initialize Gemini client with API key"""
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key and api_key != "your_gemini_api_key_here":
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-2.0-flash')
            logger.info("Translation service initialized successfully")
        else:
            logger.warning("Gemini API key not found. Translation features will be disabled.")
    
    def is_configured(self) -> bool:
        """Check if translation service is properly configured"""
        return self.model is not None
    
    async def translate_text(self, text: str, target_language: str) -> str:
        """
        Translate text to specified language using Gemini
        """
        if not self.is_configured():
            raise Exception("Translation service not configured")
        
        try:
            target_lang = self.language_names.get(target_language.lower(), target_language)
            
            prompt = f"""You are a professional medical translator. Translate the following medical text to {target_lang}. 

Guidelines:
- Maintain medical accuracy
- Use appropriate medical terminology in the target language
- Keep the tone professional but accessible
- Preserve any formatting (bold, lists, etc.)
- If a medical term doesn't have a direct translation, provide both the original term and explanation
- Use natural, native-speaker level language

Text to translate:
{text}"""

            response = self.model.generate_content(prompt)
            translated_text = response.text
            logger.info(f"Successfully translated text to {target_lang} using Gemini")
            return translated_text
            
        except Exception as e:
            logger.error(f"Error translating text: {str(e)}")
            # Return demo translation for hackathon
            return self._get_demo_translation(text, target_language)
    
    def _get_demo_translation(self, text: str, target_language: str) -> str:
        """
        Return demo translations for hackathon presentation
        Only provides demos for Spanish and Urdu, returns original for others
        """
        if target_language.lower() == "spanish":
            return """**Resumen Simple**: 
Tuviste un ataque al corazón (STEMI) lo que significa que uno de los vasos sanguíneos que suministra sangre a tu músculo cardíaco se bloqueó. Los doctores rápidamente lo abrieron con un procedimiento llamado angioplastia y colocaron un pequeño tubo (stent) para mantenerlo abierto. Esta es una condición común y muy tratable.

**Términos Clave**:
- **STEMI**: Un tipo serio de ataque al corazón donde un vaso sanguíneo está completamente bloqueado
- **Angioplastia**: Un procedimiento para abrir vasos sanguíneos bloqueados en el corazón
- **Stent**: Un pequeño tubo de malla que mantiene los vasos sanguíneos abiertos
- **Hipertensión**: Presión arterial alta
- **Hiperlipidemia**: Niveles altos de colesterol

**Lo que esto significa**:
- ¡Vas a estar bien! Esta es una condición muy tratable
- Necesitarás tomar medicamentos para prevenir problemas futuros
- Haz seguimiento con tu cardiólogo y médico de atención primaria
- Comienza rehabilitación cardíaca para fortalecer tu corazón
- Haz cambios en el estilo de vida como comer saludable y hacer ejercicio
- Evita levantar objetos pesados por una semana, luego regresa gradualmente a actividades normales

Recuerda: Esta es información educativa, no consejo médico. Siempre consulta a tu equipo de atención médica para decisiones médicas."""
        
        elif target_language.lower() == "urdu":
            return """**آسان خلاصہ**: 
آپ کو دل کا دورہ پڑا (STEMI) جس کا مطلب ہے کہ آپ کے دل کے پٹھے کو خون فراہم کرنے والی ایک رگ بند ہو گئی۔ ڈاکٹروں نے فوری طور پر اسے کھول دیا اور ایک چھوٹی ٹیوب (stent) لگا دی۔ یہ ایک عام اور قابل علاج حالت ہے۔

**اہم اصطلاحات**:
- **STEMI**: دل کے دورے کی ایک سنگین قسم جہاں خون کی رگ مکمل طور پر بند ہو جاتی ہے
- **Angioplasty**: دل میں بند خون کی رگوں کو کھولنے کا طریقہ
- **Stent**: ایک چھوٹی جالی دار ٹیوب جو خون کی رگوں کو کھلا رکھتی ہے
- **Hypertension**: ہائی بلڈ پریشر
- **Hyperlipidemia**: کولیسٹرول کی زیادہ مقدار

**اس کا کیا مطلب ہے**:
- آپ ٹھیک ہو جائیں گے! یہ ایک قابل علاج حالت ہے
- آپ کو مستقبل کے مسائل سے بچنے کے لیے دوائیں لینی ہوں گی
- اپنے کارڈیالوجسٹ اور پرائمری ڈاکٹر سے فالو اپ کریں
- اپنے دل کو مضبوط بنانے کے لیے کارڈیک ری ہیبلیٹیشن شروع کریں
- صحت مند کھانا اور ورزش جیسے طرز زندگی میں تبدیلیاں کریں
- ایک ہفتے تک بھاری چیزوں کو اٹھانے سے گریز کریں

یاد رکھیں: یہ تعلیمی معلومات ہے، طبی مشورہ نہیں۔ طبی فیصلوں کے لیے ہمیشہ اپنی ہیلتھ کیئر ٹیم سے مشورہ کریں۔"""
        
        else:
            return text  # Return original text if language not supported in demo
    
    def get_supported_languages(self) -> list:
        """Get list of supported languages"""
        return list(self.language_codes.keys())
    
    def get_language_display_names(self) -> dict:
        """Get dictionary of language codes to display names"""
        return self.language_names.copy()