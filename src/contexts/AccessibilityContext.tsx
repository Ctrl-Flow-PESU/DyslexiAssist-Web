import { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilitySettings {
  fontSize: number;
  lineSpacing: number;
  speechRate: number;
  letterSpacing: number;
  highContrast: boolean;
  useOpenDyslexic: boolean;
}

interface AccessibilityContextType {
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
  }, [settings]);

  const applySettings = (settings: AccessibilitySettings) => {
    const root = document.documentElement;

    // Apply font size, line spacing, and letter spacing globally
    root.style.setProperty('--font-size', `${settings.fontSize}%`);
    root.style.setProperty('--line-spacing', settings.lineSpacing.toString());
    root.style.setProperty('--letter-spacing', `${settings.letterSpacing}px`);

    // Apply high contrast mode
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply font family
    if (settings.useOpenDyslexic) {
      root.style.setProperty('--font-family', "'OpenDyslexic', sans-serif");
    } else {
      root.style.setProperty('--font-family', "inherit");
    }
  };

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
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