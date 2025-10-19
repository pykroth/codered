import google.generativeai as genai
import os
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.model = None
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize Gemini client with API key"""
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key and api_key != "your_gemini_api_key_here":
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-2.0-flash')
            logger.info("Gemini client initialized successfully")
        else:
            logger.warning("Gemini API key not found. AI features will be disabled.")
    
    def is_configured(self) -> bool:
        """Check if AI service is properly configured"""
        return self.model is not None
    
    async def simplify_medical_text(self, medical_text: str) -> str:
        """
        Simplify medical text using Gemini 1.5 Flash
        """
        if not self.is_configured():
            raise Exception("AI service not configured")
        
        try:
            prompt = f"""You are a patient educator. Simplify the following medical summary so a 12-year-old can understand it. Keep it accurate and reassuring. Avoid jargon unless explained. Do not state that you summarized it for a 12-year-old to understand in your response. 

Format your response as:
1. **Simple Summary**: [Easy-to-understand explanation]
2. **Key Terms**: [List important medical terms with simple definitions]
3. **What This Means**: [What the patient should know/do]

Be empathetic, clear, and encouraging. Remember this is for someone who might be worried about their health.

Medical text to simplify:
{medical_text}"""

            response = self.model.generate_content(prompt)
            simplified_text = response.text
            logger.info("Successfully simplified medical text using Gemini")
            return simplified_text
            
        except Exception as e:
            logger.error(f"Error simplifying medical text: {str(e)}")
            # Return demo response for hackathon
            return self._get_demo_simplified_text()
    
    def _get_demo_simplified_text(self) -> str:
        """
        Return demo simplified text for hackathon presentation
        """
        return """**Simple Summary**: 
You had a heart attack (STEMI) which means one of the blood vessels that supplies your heart muscle got blocked. The doctors quickly opened it up with a procedure called angioplasty and put in a small tube (stent) to keep it open. This is a common and very treatable condition.

**Key Terms**:
- **STEMI**: A serious type of heart attack where a blood vessel is completely blocked
- **Angioplasty**: A procedure to open blocked blood vessels in the heart
- **Stent**: A small mesh tube that keeps blood vessels open
- **Hypertension**: High blood pressure
- **Hyperlipidemia**: High cholesterol levels

**What This Means**:
- You're going to be okay! This is a very treatable condition
- You'll need to take medications to prevent future problems
- Follow up with your cardiologist and primary care doctor
- Start cardiac rehabilitation to strengthen your heart
- Make lifestyle changes like eating healthy and exercising
- Avoid heavy lifting for a week, then gradually return to normal activities

Remember: This is educational information, not medical advice. Always consult your healthcare team for medical decisions."""
    
    async def answer_question(self, question: str, context: str = "") -> str:
        """
        Answer questions about medical text using Gemini
        """
        if not self.is_configured():
            raise Exception("AI service not configured")
        
        try:
            prompt = f"""You are a helpful medical assistant. Answer the patient's question based on the provided medical context. 

Guidelines:
- Be clear and reassuring
- Use simple language
- If you don't know something, say so
- Always remind them to consult their doctor for medical decisions
- Keep answers concise but helpful

Remember: You provide educational information, not medical advice.

Medical Context: {context}

Patient's Question: {question}"""
            
            response = self.model.generate_content(prompt)
            answer = response.text
            logger.info("Successfully answered question using Gemini")
            return answer
            
        except Exception as e:
            logger.error(f"Error answering question: {str(e)}")
            # Return demo response for hackathon
            return self._get_demo_answer(question)
    
    def _get_demo_answer(self, question: str) -> str:
        """
        Return demo answers for common questions
        """
        question_lower = question.lower()
        
        if "stemi" in question_lower or "heart attack" in question_lower:
            return "STEMI stands for ST-elevation myocardial infarction - it's a serious type of heart attack where a blood vessel supplying your heart is completely blocked. The good news is that with modern treatment (like the angioplasty you received), most people recover well. Always follow your doctor's instructions and attend all follow-up appointments."
        
        elif "stent" in question_lower:
            return "A stent is a small mesh tube that doctors place in blocked blood vessels to keep them open. It's like a tiny scaffold that helps blood flow properly to your heart. The stent stays in place permanently and helps prevent future blockages."
        
        elif "medication" in question_lower or "medicine" in question_lower:
            return "Your medications are very important for your recovery. They help prevent blood clots, lower cholesterol, control blood pressure, and protect your heart. Take them exactly as prescribed and don't stop them without talking to your doctor first."
        
        elif "exercise" in question_lower or "activity" in question_lower:
            return "Exercise is great for your heart, but start slowly. Begin with light activities like walking, and gradually increase as your doctor recommends. Cardiac rehabilitation programs are excellent for safely building up your strength and endurance."
        
        else:
            return "That's a great question! For specific medical advice about your condition, I'd recommend discussing this with your cardiologist or primary care doctor. They can give you personalized guidance based on your specific situation. Remember, this is educational information, not medical advice."
