from pydantic import BaseModel
from typing import Optional

class SimplifyRequest(BaseModel):
    text: str

class SimplifyResponse(BaseModel):
    original_text: str
    simplified_text: str
    success: bool

class QAResponse(BaseModel):
    question: str
    answer: str
    success: bool

class TranslationRequest(BaseModel):
    text: str
    target_language: str

class TranslationResponse(BaseModel):
    original_text: str
    translated_text: str
    target_language: str
    success: bool

class UploadResponse(BaseModel):
    success: bool
    filename: str
    extracted_text: str
    text_length: int
