'use client';

import { useVoiceCommands } from "@/hooks/useVoiceCommands";
import { Mic, MicOff } from "lucide-react";

export default function VoiceCommandButton() {
  const { isListening, startListening, stopListening } = useVoiceCommands();
  
  return (
    <button
      onClick={isListening ? stopListening : startListening}
      className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-colors duration-200 flex items-center justify-center ${
        isListening 
          ? 'bg-red-500 hover:bg-red-600' 
          : 'bg-green-500 hover:bg-green-600'
      }`}
      aria-label={isListening ? "Stop voice commands" : "Start voice commands"}
    >
      {isListening ? (
        <MicOff className="h-6 w-6 text-white" />
      ) : (
        <Mic className="h-6 w-6 text-white" />
      )}
    </button>
  );
} 