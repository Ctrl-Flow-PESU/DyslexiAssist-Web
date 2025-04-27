import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAccessibility, AccessibilityContextType } from '@/contexts/AccessibilityContext';

interface VoiceCommandsState {
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
}

// Create a helper function to create speech utterances with the correct rate
const createSpeech = (text: string, speechRate: number): SpeechSynthesisUtterance => {
  const speech = new SpeechSynthesisUtterance(text);
  speech.rate = speechRate;
  return speech;
};

// Default speech rate to use if context is not available
const DEFAULT_SPEECH_RATE = 1.0;

export const useVoiceCommands = (): VoiceCommandsState => {
  // Try to get settings, but provide fallback if hook is used outside provider
  let speechRate = DEFAULT_SPEECH_RATE;
  let accessibilityContext: AccessibilityContextType | null = null;
  
  try {
    accessibilityContext = useAccessibility();
    if (accessibilityContext && accessibilityContext.settings) {
      speechRate = accessibilityContext.settings.speechRate;
    }
  } catch (error) {
    console.warn("useVoiceCommands used outside AccessibilityProvider, using default speech rate");
  }
  
  const [isListening, setIsListening] = useState(false);
  const router = useRouter();
  const recognition = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('SpeechRecognition' in window) {
        recognition.current = new (window as any).SpeechRecognition();
      } else if ('webkitSpeechRecognition' in window) {
        recognition.current = new (window as any).webkitSpeechRecognition();
      }

      if (recognition.current) {
        recognition.current.continuous = false;
        recognition.current.interimResults = false;
        recognition.current.lang = 'en-US';
      } else {
        console.warn('Speech recognition not supported in this browser');
      }
    }
  }, []);

  const getSpeechRate = (): number => {
    try {
      if (accessibilityContext?.settings?.speechRate !== undefined) {
        return accessibilityContext.settings.speechRate;
      }
    } catch (e) {
      // Fallback to default if context is not available
    }
    return DEFAULT_SPEECH_RATE;
  };

  const processCommand = useCallback(async (command: string) => {
    try {
      // Get the current speech rate
      const currentSpeechRate = getSpeechRate();

      // Handle navigation commands directly first
      const navigationCommands = {
        menu: '/',
        home: '/',
        'reading test': '/reading-test',
        dictation: '/dictation-test',
        contrast: '/contrast-test'
      };

      // Check if it's a navigation command
      for (const [key, route] of Object.entries(navigationCommands)) {
        if (command.toLowerCase().includes(key)) {
          router.push(route);
          return;
        }
      }

      // Handle read out command
      if (command.toLowerCase().includes('read out')) {
        const mainContent = document.querySelector('main');
        if (mainContent) {
          const textToRead = mainContent.textContent || '';
          const speech = createSpeech(textToRead, currentSpeechRate);
          window.speechSynthesis.speak(speech);
          return;
        }
      }

      // Handle help command directly
      if (command.toLowerCase().includes('help')) {
        const speech = createSpeech(
          'Available commands: menu, reading test, dictation, contrast test, read out, and help',
          currentSpeechRate
        );
        window.speechSynthesis.speak(speech);
        return;
      }

      // If not handled directly, send to API
      const response = await fetch('/api/voice-command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          command: command.toLowerCase(),
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText} (${response.status})`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Handle API response
      if (data.action === 'speak') {
        const speech = createSpeech(data.text, currentSpeechRate);
        window.speechSynthesis.speak(speech);
      } else if (data.action === 'navigate') {
        router.push(data.route);
      }

    } catch (error) {
      console.error('Error processing voice command:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const errorSpeech = createSpeech(
        `Sorry, I could not process that command. ${errorMessage}`,
        getSpeechRate()
      );
      window.speechSynthesis.speak(errorSpeech);
    }
  }, [router, accessibilityContext]);

  const startListening = useCallback(() => {
    if (recognition.current && !isListening) {
      recognition.current.onresult = (event: SpeechRecognitionEvent) => {
        const command = event.results[event.results.length - 1][0].transcript;
        processCommand(command);
      };

      recognition.current.onstart = () => setIsListening(true);
      recognition.current.onend = () => setIsListening(false);

      try {
        recognition.current.start();
        // Provide feedback when voice recognition starts
        const startSpeech = createSpeech('Listening for commands', getSpeechRate());
        window.speechSynthesis.speak(startSpeech);
      } catch (error) {
        console.error('Error starting voice recognition:', error);
      }
    }
  }, [isListening, processCommand]);

  const stopListening = useCallback(() => {
    if (recognition.current && isListening) {
      recognition.current.stop();
      setIsListening(false);
      // Provide feedback when voice recognition stops
      const stopSpeech = createSpeech('Voice commands stopped', getSpeechRate());
      window.speechSynthesis.speak(stopSpeech);
    }
  }, [isListening]);

  return {
    isListening,
    startListening,
    stopListening,
  };
};