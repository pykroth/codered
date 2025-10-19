import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Loader } from 'lucide-react';
import { textToSpeech } from '../src/services/api';

function VoicePlayer({ text, className = "" }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  const handlePlay = async () => {
    if (!text || text.trim().length === 0) {
      setError("No text to speak");
      return;
    }

    if (isLoading || isPlaying) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await textToSpeech(text);
      
      if (response.success && response.audio_data) {
        // Convert base64 to blob
        const audioBlob = new Blob([
          Uint8Array.from(atob(response.audio_data), c => c.charCodeAt(0))
        ], { type: 'audio/mpeg' });
        
        const url = URL.createObjectURL(audioBlob);
        audioRef.current = new Audio(url);
        
        audioRef.current.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(url);
        };
        
        audioRef.current.onerror = () => {
          setIsPlaying(false);
          setError("Failed to play audio");
        };

        await audioRef.current.play();
        setIsPlaying(true);
      } else {
        setError("Failed to generate speech");
      }
    } catch (err) {
      console.error('Voice generation error:', err);
      setError("Failed to generate speech");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  if (!text || text.trim().length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {error && (
        <div className="text-red-500 text-xs">
          {error}
        </div>
      )}
      
      <button
        onClick={isPlaying ? handleStop : handlePlay}
        disabled={isLoading}
        className={`
          flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium
          transition-colors duration-200
          ${isLoading 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : isPlaying
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }
        `}
        title={isPlaying ? "Stop speaking" : "Listen to this text"}
      >
        {isLoading ? (
          <Loader className="h-4 w-4 animate-spin" />
        ) : isPlaying ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
        <span>
          {isLoading ? "Generating..." : isPlaying ? "Stop" : "Listen"}
        </span>
      </button>
    </div>
  );
}

export default VoicePlayer;
