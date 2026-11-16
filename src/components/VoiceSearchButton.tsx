import React, { useState, useEffect } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { Language } from '../types';

interface VoiceSearchButtonProps {
  language: Language;
  onTranscript: (text: string) => void;
}

export const VoiceSearchButton: React.FC<VoiceSearchButtonProps> = ({
  language,
  onTranscript
}) => {
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice search is not supported in this browser. Please use Chrome/Edge or type your search.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      // Choose language based on active selection (hi-IN or en-IN)
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onTranscript(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={startListening}
        className={`p-1.5 rounded transition ${
          isListening
            ? 'bg-brick text-white animate-pulse'
            : 'text-ink-muted hover:text-ink dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-concrete dark:hover:bg-charcoal-700'
        }`}
        title={isListening ? 'Listening...' : 'Voice Search (Hindi / English)'}
      >
        <Mic className="w-4 h-4" />
      </button>

      {isListening && (
        <div className="absolute right-0 top-full mt-2 w-48 p-2 bg-surface dark:bg-charcoal-800 border border-subtle rounded shadow-lg text-[11px] text-center text-ink dark:text-zinc-200 z-50 animate-fadeIn">
          <div className="flex items-center justify-center gap-1.5 text-brick font-semibold">
            <span className="w-2 h-2 rounded-full bg-brick animate-ping" />
            <span>Listening...</span>
          </div>
          <p className="text-[10px] text-ink-muted mt-0.5">
            {language === 'hi' ? 'हिंदी या अंग्रेजी में बोलें...' : 'Speak product name or brand...'}
          </p>
        </div>
      )}
    </div>
  );
};
