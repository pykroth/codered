
## Inspiration
Understanding medical reports should not be difficult. Many people struggle with:
- Medical jargon that sounds like a foreign language  
- Overwhelming test results and diagnoses they cannot interpret  
- Language barriers that prevent proper understanding of their health  

MedLens was created for individuals who need clear and simple explanations of their medical reports in their own language.  
Powered by AI, MedLens aims to make healthcare information accessible to everyone, regardless of medical knowledge or language barriers.

---

## What It Does
MedLens transforms complex medical reports into easy-to-understand explanations using AI.  
Users can upload their medical documents, receive simplified interpretations, and ask follow-up questions in their preferred language.

### Key Features
- **Smart Document Processing** – Upload PDFs or images of medical reports.  
- **AI-Powered Simplification** – Converts complex medical terms into plain language.  
- **Multi-Language Support** – Provides explanations in English, Spanish, Urdu, French, Arabic, and Hindi.  
- **Interactive Q&A** – Allows users to ask questions about their reports in any supported language.  
- **Text-to-Speech** – Enables users to listen to explanations with natural voice synthesis.  
- **Privacy-Focused** – Ensures medical data remains secure through local processing.

---

## How It Was Built

### Technologies Used
| Layer | Tools & Frameworks |
|-------|--------------------|
| **Frontend** | ![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB) ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white) ![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=react-router&logoColor=white) |
| **Backend** | ![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white) ![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white) |
| **AI Model** | Google Gemini 2.0 Flash |
| **OCR** | Tesseract (local), pdfplumber |
| **Voice Integration** | ElevenLabs API |
| **Middleware** | CORS |
| **Storage** | In-memory state management |

---

## Future Improvements
- Implement secure authentication for patient data  
- Introduce encrypted cloud storage  
- Expand language support for broader accessibility  
- Develop a mobile version for easier use  

---

## Acknowledgments
Developed to make healthcare information understandable and accessible to all.
