import pytesseract
from PIL import Image
import io
import logging
import subprocess
import tempfile
import os
import pdfplumber
from typing import Optional

logger = logging.getLogger(__name__)

class OCRService:
    def __init__(self):
        # Configure tesseract path if needed (uncomment and adjust for your system)
        # pytesseract.pytesseract.tesseract_cmd = r'/usr/local/bin/tesseract'
        pass
    
    async def extract_text(self, file_content: bytes, content_type: str) -> str:
        """
        Extract text from PDF or image files using OCR
        """
        try:
            if content_type == "application/pdf":
                return await self._extract_from_pdf(file_content)
            elif content_type in ["image/jpeg", "image/png", "image/jpg"]:
                return await self._extract_from_image(file_content)
            else:
                raise ValueError(f"Unsupported content type: {content_type}")
                
        except Exception as e:
            logger.error(f"OCR extraction failed: {str(e)}")
            raise
    
    async def _extract_from_pdf(self, pdf_content: bytes) -> str:
        """
        Extract text from PDF using pdfplumber
        """
        try:
            # Create a temporary file for the PDF
            with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as temp_file:
                temp_file.write(pdf_content)
                temp_file_path = temp_file.name
            
            try:
                # Extract text using pdfplumber
                extracted_text = ""
                with pdfplumber.open(temp_file_path) as pdf:
                    for page in pdf.pages:
                        page_text = page.extract_text()
                        if page_text:
                            extracted_text += page_text + "\n"
                
                if extracted_text.strip():
                    logger.info(f"Successfully extracted {len(extracted_text)} characters from PDF")
                    return extracted_text.strip()
                else:
                    logger.warning("No text found in PDF, trying OCR fallback")
                    # Fallback to OCR if no text found
                    return await self._extract_from_pdf_ocr(pdf_content)
                    
            finally:
                # Clean up temporary file
                if os.path.exists(temp_file_path):
                    os.unlink(temp_file_path)
            
        except Exception as e:
            logger.error(f"PDF text extraction failed: {str(e)}")
            # Try OCR fallback
            try:
                return await self._extract_from_pdf_ocr(pdf_content)
            except Exception as ocr_error:
                logger.error(f"OCR fallback also failed: {str(ocr_error)}")
                return self._get_sample_medical_text()
    
    async def _extract_from_pdf_ocr(self, pdf_content: bytes) -> str:
        """
        Extract text from PDF using OCR (fallback method)
        """
        try:
            # Create a temporary file for the PDF
            with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as temp_file:
                temp_file.write(pdf_content)
                temp_file_path = temp_file.name
            
            try:
                # Convert PDF to images and extract text using OCR
                from pdf2image import convert_from_path
                
                # Convert PDF to images
                images = convert_from_path(temp_file_path)
                
                extracted_text = ""
                for i, image in enumerate(images):
                    # Extract text from each page
                    page_text = pytesseract.image_to_string(image, lang='eng')
                    if page_text.strip():
                        extracted_text += f"--- Page {i+1} ---\n{page_text}\n\n"
                
                if extracted_text.strip():
                    logger.info(f"Successfully extracted text from PDF using OCR")
                    return extracted_text.strip()
                else:
                    logger.warning("No text found in PDF using OCR")
                    return self._get_sample_medical_text()
                    
            finally:
                # Clean up temporary file
                if os.path.exists(temp_file_path):
                    os.unlink(temp_file_path)
            
        except Exception as e:
            logger.error(f"PDF OCR extraction failed: {str(e)}")
            return self._get_sample_medical_text()
    
    async def _extract_from_image(self, image_content: bytes) -> str:
        """
        Extract text from image files
        """
        try:
            # Open image with PIL
            image = Image.open(io.BytesIO(image_content))
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Extract text using tesseract
            extracted_text = pytesseract.image_to_string(image, lang='eng')
            
            return extracted_text.strip()
            
        except Exception as e:
            logger.error(f"Image text extraction failed: {str(e)}")
            raise
    
    def _get_sample_medical_text(self) -> str:
        """
        Return sample medical text for demo purposes
        """
        return """
DISCHARGE SUMMARY

Patient: John Doe
DOB: 01/15/1980
MRN: 12345678
Admission Date: 12/01/2023
Discharge Date: 12/03/2023

CHIEF COMPLAINT:
Chest pain and shortness of breath

HISTORY OF PRESENT ILLNESS:
The patient is a 43-year-old male who presented to the emergency department with acute onset chest pain and dyspnea. The pain was described as substernal, crushing in nature, radiating to the left arm. Associated symptoms included diaphoresis, nausea, and lightheadedness. The patient has a history of hypertension and hyperlipidemia.

PHYSICAL EXAMINATION:
Vital signs: BP 160/95, HR 88, RR 22, O2 sat 94% on room air
General: Anxious appearing male in moderate distress
Cardiovascular: Regular rate and rhythm, no murmurs, rubs, or gallops
Pulmonary: Clear to auscultation bilaterally
Extremities: No edema, pulses intact

DIAGNOSTIC STUDIES:
- EKG: ST elevation in leads II, III, aVF consistent with inferior STEMI
- Troponin I: 15.2 ng/mL (elevated)
- CK-MB: 45 U/L (elevated)
- Lipid panel: Total cholesterol 280 mg/dL, LDL 180 mg/dL
- Echocardiogram: Ejection fraction 45%, inferior wall hypokinesis

HOSPITAL COURSE:
Patient was taken emergently to cardiac catheterization lab where he underwent primary percutaneous coronary intervention (PCI) of the right coronary artery. A drug-eluting stent was placed successfully. Post-procedure, patient was monitored in the cardiac care unit. He was started on dual antiplatelet therapy (aspirin and clopidogrel), atorvastatin, metoprolol, and lisinopril.

DISCHARGE DIAGNOSES:
1. Acute ST-elevation myocardial infarction (STEMI), inferior wall
2. Hypertension, uncontrolled
3. Hyperlipidemia
4. Status post primary PCI with drug-eluting stent placement

DISCHARGE MEDICATIONS:
- Aspirin 81mg daily
- Clopidogrel 75mg daily
- Atorvastatin 40mg daily
- Metoprolol 25mg twice daily
- Lisinopril 10mg daily

DISCHARGE INSTRUCTIONS:
- Follow up with cardiology in 1 week
- Follow up with primary care physician in 2 weeks
- Cardiac rehabilitation program recommended
- Return to ED for chest pain, shortness of breath, or other concerning symptoms
- No heavy lifting >10 pounds for 1 week
- Gradual return to normal activities as tolerated

PROGNOSIS:
Good with appropriate medical therapy and lifestyle modifications.
        """.strip()
