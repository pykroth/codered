from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv
import logging
from typing import Optional, List
import json

from services.ocr_service import OCRService
from services.ai_service import AIService
from services.translation_service import TranslationService
from services.voice_service import VoiceService
from models.schemas import (
    SimplifyRequest, 
    SimplifyResponse, 
    QAResponse, 
    TranslationRequest,
    TranslationResponse
)

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="MedLens API",
    description="AI-powered medical report explanation service",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000","https://codered-w5ep.onrender.com",],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
ocr_service = OCRService()
ai_service = AIService()
translation_service = TranslationService()
voice_service = VoiceService()

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "MedLens API is running!", "status": "healthy"}

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "services": {
            "ocr": "ready",
            "ai": "ready" if ai_service.is_configured() else "not_configured",
            "translation": "ready" if translation_service.is_configured() else "not_configured",
            "voice": "ready" if voice_service.is_configured() else "not_configured"
        }
    }

@app.post("/upload", response_model=dict)
async def upload_file(file: UploadFile = File(...)):
    """
    Upload and extract text from medical reports (PDF/image)
    """
    try:
        logger.info(f"Processing file: {file.filename}")
        
        # Validate file type
        allowed_types = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400, 
                detail=f"File type {file.content_type} not supported. Please upload PDF, JPEG, or PNG files."
            )
        
        # Read file content
        content = await file.read()
        
        # Extract text using OCR
        extracted_text = await ocr_service.extract_text(content, file.content_type)
        
        if not extracted_text or len(extracted_text.strip()) < 10:
            raise HTTPException(
                status_code=400,
                detail="Could not extract meaningful text from the file. Please ensure the file contains readable text."
            )
        
        logger.info(f"Successfully extracted {len(extracted_text)} characters")
        
        return {
            "success": True,
            "filename": file.filename,
            "extracted_text": extracted_text,
            "text_length": len(extracted_text)
        }
        
    except Exception as e:
        logger.error(f"Error processing file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.post("/simplify", response_model=SimplifyResponse)
async def simplify_diagnosis(request: SimplifyRequest):
    """
    Simplify medical text using AI
    """
    try:
        logger.info("Simplifying medical text")
        
        if not ai_service.is_configured():
            raise HTTPException(
                status_code=500,
                detail="AI service not configured. Please check OpenAI API key."
            )
        
        simplified_text = await ai_service.simplify_medical_text(request.text)
        
        return SimplifyResponse(
            original_text=request.text,
            simplified_text=simplified_text,
            success=True
        )
        
    except Exception as e:
        logger.error(f"Error simplifying text: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error simplifying text: {str(e)}")

@app.post("/ask", response_model=QAResponse)
async def ask_question(request: dict):
    """
    Answer questions about medical text using AI
    """
    try:
        question = request.get("question", "")
        context = request.get("context", "")
        
        if not question.strip():
            raise HTTPException(status_code=400, detail="Question is required")
        
        logger.info(f"Answering question: {question[:50]}...")
        
        answer = await ai_service.answer_question(question, context)
        
        return QAResponse(
            question=question,
            answer=answer,
            success=True
        )
        
    except Exception as e:
        logger.error(f"Error answering question: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error answering question: {str(e)}")

@app.post("/translate", response_model=TranslationResponse)
async def translate_text(request: TranslationRequest):
    """
    Translate text to specified language
    """
    try:
        logger.info(f"Translating text to {request.target_language}")
        
        translated_text = await translation_service.translate_text(
            request.text, 
            request.target_language
        )
        
        return TranslationResponse(
            original_text=request.text,
            translated_text=translated_text,
            target_language=request.target_language,
            success=True
        )
        
    except Exception as e:
        logger.error(f"Error translating text: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error translating text: {str(e)}")

@app.post("/text-to-speech")
async def text_to_speech(request: dict):
    """
    Convert text to speech using ElevenLabs
    """
    try:
        text = request.get("text", "")
        if not text:
            raise HTTPException(status_code=400, detail="Text is required")
        
        if not voice_service.is_configured():
            raise HTTPException(status_code=503, detail="Voice service not configured")
        
        # Generate speech
        audio_data = await voice_service.text_to_speech(text)
        
        if audio_data is None:
            raise HTTPException(status_code=500, detail="Failed to generate speech")
        
        # Return audio data as base64 for frontend
        import base64
        audio_base64 = base64.b64encode(audio_data).decode('utf-8')
        
        return {
            "success": True,
            "audio_data": audio_base64,
            "text_length": len(text)
        }
        
    except Exception as e:
        logger.error(f"Error in text-to-speech: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating speech: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app", 
        host=os.getenv("HOST", "0.0.0.0"), 
        port=int(os.getenv("PORT", 8000)), 
        reload=os.getenv("DEBUG", "True").lower() == "true"
    )
