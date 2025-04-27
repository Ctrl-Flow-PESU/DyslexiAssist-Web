"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ContrastTester, ColorCombination } from "@/lib/ContrastTester";
import { useTheme } from "@/contexts/ThemeContext";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BackToHomeButton from '@/components/BackToHomeButton';

interface TestResults {
  best_combination: string;
  contrast_ratio: string;
  comfort_rating: number;
  recommendations: string[];
}

interface TestState {
  started: boolean;
  completed: boolean;
  results: TestResults | null;
}

export default function ContrastTest() {
  const { setColors } = useTheme();
  const { settings } = useAccessibility();
  const [mounted, setMounted] = useState(false);
  const [tester] = useState(() => new ContrastTester());
  const [state, setState] = useState<TestState>({
    started: false,
    completed: false,
    results: null
  });
  const [comfort, setComfort] = useState(5);
  const [currentCombo, setCurrentCombo] = useState<ColorCombination | null>(null);
  const [currentText, setCurrentText] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  const startTest = () => {
    setCurrentCombo(tester.getCurrentCombination());
    setCurrentText(tester.getCurrentText());
    setState(prev => ({ ...prev, started: true }));
  };

  const submitFeedback = () => {
    tester.recordFeedback(comfort);
    const hasNext = tester.next();

    if (hasNext) {
      setCurrentCombo(tester.getCurrentCombination());
      setCurrentText(tester.getCurrentText());
      setComfort(5);
    } else {
      setState({
        started: false,
        completed: true,
        results: tester.getResults()
      });
    }
  };

  const getBackgroundStyle = () => ({
    backgroundColor: `rgb(${currentCombo!.bg.join(",")})`,
    color: `rgb(${currentCombo!.text.join(",")})`,
  });

  // Define card styling based on high contrast mode
  const cardClassName = settings.highContrast 
    ? "max-w-2xl w-full h-full p-8 bg-black text-white border-2 border-white" 
    : "max-w-2xl w-full h-full p-8";

  if (state.completed && state.results) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <BackToHomeButton />
          
          <div className="flex items-center justify-center">
            <Card className={cardClassName}>
              <h1 className={`text-2xl font-bold mb-6 ${settings.highContrast ? 'text-white' : ''}`}>Test Results</h1>
              <div className="space-y-4">
                <p className={settings.highContrast ? 'text-white' : ''}><strong>Best Color Combination:</strong> {state.results.best_combination}</p>
                <p className={settings.highContrast ? 'text-white' : ''}><strong>Contrast Ratio:</strong> {state.results.contrast_ratio}:1</p>
                <p className={settings.highContrast ? 'text-white' : ''}><strong>Comfort Rating:</strong> {state.results.comfort_rating}/10</p>
                <div className="mt-6">
                  <h2 className={`font-bold mb-2 ${settings.highContrast ? 'text-white' : ''}`}>Recommendations:</h2>
                  <ul className="list-disc pl-6">
                    {state.results.recommendations.map((rec, index) => (
                      <li key={index} className={settings.highContrast ? 'text-white' : ''}>{rec}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-4 mt-6">
                  <Button 
                    variant="default"
                    size="lg"
                    onClick={() => {
                      const bestCombo = tester.getColorCombinationByName(state.results!.best_combination);
                      if (bestCombo) {
                        setColors(bestCombo.bg, bestCombo.text);
                      }
                    }} 
                    className="w-full"
                  >
                    Apply This Color Combination
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <BackToHomeButton />
        
        <div className="flex items-center justify-center">
          <Card className={cardClassName}>
            {!state.started ? (
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className={`text-2xl font-bold ${settings.highContrast ? 'text-white' : ''}`}>Contrast Comfort Test</h1>
                  <p className={`${settings.highContrast ? 'text-white' : 'text-muted-foreground'}`}>
                    This test will help determine the most comfortable text and background
                    color combination for your reading experience.
                  </p>
                  <Button onClick={startTest} size="lg" variant="default" className="mt-6">
                    Start Test
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <h2 className={`text-xl font-semibold ${settings.highContrast ? 'text-white' : ''}`}>Visual Comfort Test</h2>
                <div 
                  className="p-6 rounded-lg min-h-[200px] flex items-center justify-center text-center border border-gray-300"
                  style={getBackgroundStyle()}
                >
                  <p className="text-lg">{currentText}</p>
                </div>
                
                <div>
                  <p className={`mb-2 ${settings.highContrast ? 'text-white' : ''}`}>Current combination: {currentCombo!.name}</p>
                  <p className={`mb-4 ${settings.highContrast ? 'text-white' : ''}`}>How comfortable is this combination for reading?</p>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Slider
                        defaultValue={[comfort]}
                        value={[comfort]}
                        onValueChange={(value: number[]) => setComfort(value[0])}
                        min={1}
                        max={10}
                        step={1}
                        className="flex-1"
                      />
                      <span className={`min-w-[2rem] text-center font-medium ${settings.highContrast ? 'text-white' : ''}`}>
                        {comfort}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={settings.highContrast ? 'text-white' : 'text-muted-foreground'}>Uncomfortable (1)</span>
                      <span className={settings.highContrast ? 'text-white' : 'text-muted-foreground'}>Very Comfortable (10)</span>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="default"
                  onClick={submitFeedback} 
                  size="lg" 
                  className="w-full"
                >
                  Continue
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}