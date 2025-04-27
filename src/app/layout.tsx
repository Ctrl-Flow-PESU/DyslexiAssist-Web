'use client';

import { ThemeProvider } from "@/contexts/ThemeContext";
<<<<<<< HEAD
import { AccessibilityProvider, useAccessibility } from "@/contexts/AccessibilityContext";
import { useVoiceCommands } from "@/hooks/useVoiceCommands";
import { Mic, MicOff } from "lucide-react";
import SettingsPanel from "@/components/SettingsPanel";
=======
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import SettingsPanel from "@/components/SettingsPanel";
import ClientSideOnly from "@/components/ClientSideOnly";
import VoiceCommandButton from "@/components/VoiceCommandButton";
>>>>>>> b7855126dbcd7f0b3a11cb8a31d9763247d22b51
import "./globals.css";

function AppWrapper({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
<<<<<<< HEAD
      <body suppressHydrationWarning={true}>
=======
      <body suppressHydrationWarning={true} className="dyslexia-friendly">
>>>>>>> b7855126dbcd7f0b3a11cb8a31d9763247d22b51
        <div className="voice-indicator">
          <div className="voice-indicator-dot" />
        </div>
<<<<<<< HEAD
        <AccessibilityProvider>
          <ThemeProvider>
            <AppWrapper>
              <SettingsPanel />
              {children}
            </AppWrapper>
          </ThemeProvider>
        </AccessibilityProvider>
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
=======
        <ThemeProvider>
          <AccessibilityProvider>
            <SettingsPanel />
            {children}
            <ClientSideOnly>
              <VoiceCommandButton />
            </ClientSideOnly>
          </AccessibilityProvider>
        </ThemeProvider>
>>>>>>> b7855126dbcd7f0b3a11cb8a31d9763247d22b51
      </body>
    </html>
  );
}