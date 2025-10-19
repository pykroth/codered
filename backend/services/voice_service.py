import os
import logging
import elevenlabs
from elevenlabs import Voice, VoiceSettings
import tempfile
from typing import Optional

logger = logging.getLogger(__name__)

class VoiceService:
    def __init__(self):
        self.api_key = None
        self.voice_id = None
        self.client = None
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize ElevenLabs client with API key"""
        self.api_key = os.getenv("ELEVENLABS_API_KEY")
        self.voice_id = os.getenv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM")  # Default warm voice
        
        if self.api_key and self.api_key != "your_elevenlabs_api_key_here":
            try:
                # Set the API key for elevenlabs
                os.environ["ELEVEN_API_KEY"] = self.api_key
                self.client = elevenlabs.ElevenLabs()
                logger.info("Voice service initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize ElevenLabs client: {str(e)}")
                self.client = None
        else:
            logger.warning("ElevenLabs API key not found. Voice features will be disabled.")
    
    def is_configured(self) -> bool:
        """Check if voice service is properly configured"""
        return self.client is not None and self.api_key is not None and self.api_key != "your_elevenlabs_api_key_here"
    
    async def text_to_speech(self, text: str) -> Optional[bytes]:
        """
        Convert text to speech using ElevenLabs
        Returns audio data as bytes
        """
        if not self.is_configured():
            logger.warning("Voice service not configured")
            return None
        
        try:
            # Clean text for better speech synthesis
            cleaned_text = self._clean_text_for_speech(text)
            
            # Generate speech with warm, family-like voice settings
            audio_iterator = self.client.text_to_speech.convert(
                voice_id=self.voice_id,
                text=cleaned_text,
                voice_settings=VoiceSettings(
                    stability=0.75,  # More stable, less variation
                    similarity_boost=0.8,  # Closer to original voice
                    style=0.3,  # Slightly more expressive
                    use_speaker_boost=True  # Enhance voice clarity
                )
            )
            
            # Convert iterator to bytes
            audio_bytes = b''.join(audio_iterator)
            
            logger.info(f"Successfully generated speech for {len(text)} characters")
            return audio_bytes
            
        except Exception as e:
            logger.error(f"Error generating speech: {str(e)}")
            # Return demo audio for hackathon purposes
            return self._get_demo_audio()

    def _get_demo_audio(self) -> bytes:
        """Generate demo audio data for when API is not available"""
        # Create a simple audio file (silence) for demo purposes
        # In a real implementation, you'd have a pre-recorded demo audio
        import wave
        import io
        
        # Create a simple 1-second silence audio
        sample_rate = 22050
        duration = 1  # seconds
        frames = int(sample_rate * duration)
        
        # Create a simple sine wave as demo audio
        import math
        audio_data = []
        for i in range(frames):
            # Simple sine wave at 440Hz (A note)
            value = int(32767 * 0.1 * math.sin(2 * math.pi * 440 * i / sample_rate))
            audio_data.append(value)
        
        # Convert to bytes (16-bit PCM)
        audio_bytes = b''.join([value.to_bytes(2, byteorder='little', signed=True) for value in audio_data])
        
        logger.info("Using demo audio due to API limitations")
        return audio_bytes
    
    def _clean_text_for_speech(self, text: str) -> str:
        """
        Clean text to make it more suitable for speech synthesis
        """
        # Remove markdown formatting
        cleaned = text.replace("**", "").replace("*", "")
        
        # Replace common medical abbreviations with full words
        replacements = {
            "STEMI": "S-T-E-M-I",
            "PCI": "P-C-I", 
            "LAD": "L-A-D",
            "ECG": "E-C-G",
            "BP": "blood pressure",
            "HR": "heart rate",
            "mg": "milligrams",
            "ml": "milliliters",
            "vs": "versus",
            "w/": "with",
            "w/o": "without"
        }
        
        for abbrev, full in replacements.items():
            cleaned = cleaned.replace(abbrev, full)
        
        # Add pauses for better speech flow
        cleaned = cleaned.replace(".", ". ")
        cleaned = cleaned.replace(":", ": ")
        cleaned = cleaned.replace(";", "; ")
        
        return cleaned.strip()
    
    def get_available_voices(self) -> list:
        """
        Get list of available voices (for future use)
        """
        if not self.is_configured():
            return []
        
        try:
            from elevenlabs import voices
            voice_list = voices()
            return [{"id": voice.voice_id, "name": voice.name} for voice in voice_list]
        except Exception as e:
            logger.error(f"Error fetching voices: {str(e)}")
            return []
