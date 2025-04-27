"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
  colors: {
    background: string;
    text: string;
  };
  setColors: (bg: [number, number, number], text: [number, number, number]) => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [colors, setColorsState] = useState({
    background: "rgb(255, 248, 229)", // Default cream background
    text: "rgb(0, 0, 0)", // Default black text
  });

  useEffect(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('themeColors');
      if (saved) {
        const savedColors = JSON.parse(saved);
        setColorsState(savedColors);
        document.body.style.backgroundColor = savedColors.background;
        document.body.style.color = savedColors.text;
      }
    }
    setMounted(true);
  }, []);

  const setColors = (bg: [number, number, number], text: [number, number, number]) => {
    const newBg = `rgb(${bg.join(",")})`;
    const newText = `rgb(${text.join(",")})`;
    const newColors = {
      background: newBg,
      text: newText,
    };
    
    setColorsState(newColors);
    localStorage.setItem('themeColors', JSON.stringify(newColors));
    document.body.style.backgroundColor = newBg;
    document.body.style.color = newText;
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ colors, setColors, mounted }}>
      <div style={{ 
        backgroundColor: colors.background,
        color: colors.text,
        minHeight: '100vh',
        transition: 'background-color 0.3s, color 0.3s'
      }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};