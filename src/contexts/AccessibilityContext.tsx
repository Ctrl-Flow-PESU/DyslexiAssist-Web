import { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilitySettings {
  fontSize: number;
  lineSpacing: number;
  speechRate: number;
  letterSpacing: number;
  highContrast: boolean;
  useOpenDyslexic: boolean;
}

export interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  lineSpacing: 1.5,
  speechRate: 1,
  letterSpacing: 0,
  highContrast: false,
  useOpenDyslexic: true,
};

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('accessibilitySettings');
      return saved ? JSON.parse(saved) : defaultSettings;
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    applySettings(settings);
    
    // Dispatch a custom event to notify other components
    const event = new CustomEvent('accessibilityChanged', { detail: settings });
    document.dispatchEvent(event);
  }, [settings]);

  const applySettings = (settings: AccessibilitySettings) => {
    // Apply font size - set both CSS variable and inline styles
    document.documentElement.style.setProperty('--font-scale', `${settings.fontSize}%`);
    
    // Direct DOM manipulation for font size to ensure it applies
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    
    // Apply font size directly to html and body
    htmlElement.style.fontSize = `${settings.fontSize}%`;
    bodyElement.style.fontSize = `${settings.fontSize}%`;
    
    // Apply line spacing
    document.documentElement.style.setProperty('--line-height', settings.lineSpacing.toString());
    bodyElement.style.lineHeight = settings.lineSpacing.toString();
    
    // Apply letter spacing
    document.documentElement.style.setProperty('--letter-spacing', `${settings.letterSpacing}px`);
    bodyElement.style.letterSpacing = `${settings.letterSpacing}px`;
    
    // Apply speech rate
    document.documentElement.style.setProperty('--speech-rate', settings.speechRate.toString());
    
    // Apply high contrast mode
    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    // Apply font family
    if (settings.useOpenDyslexic) {
      document.documentElement.classList.add('font-dyslexic');
      document.documentElement.classList.remove('font-sans');
    } else {
      document.documentElement.classList.remove('font-dyslexic');
      document.documentElement.classList.add('font-sans');
    }
    
    // Force a refresh on dialogs and menus by adding/removing a class
    document.documentElement.classList.add('refresh-styles');
    setTimeout(() => {
      document.documentElement.classList.remove('refresh-styles');
    }, 10);
  };

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
