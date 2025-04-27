'use client';

import { ThemeProvider } from "@/contexts/ThemeContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import SettingsPanel from "@/components/SettingsPanel";
import ClientSideOnly from "@/components/ClientSideOnly";
import VoiceCommandButton from "@/components/VoiceCommandButton";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className="dyslexia-friendly">
        <div className="voice-indicator">
          <div className="voice-indicator-dot" />
        </div>
        <ThemeProvider>
          <AccessibilityProvider>
            <SettingsPanel />
            {children}
            <ClientSideOnly>
              <VoiceCommandButton />
            </ClientSideOnly>
          </AccessibilityProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
