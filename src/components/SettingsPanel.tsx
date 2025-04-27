import { Settings as SettingsIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function SettingsPanel() {
  const { settings, updateSettings } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);
  const [forceRender, setForceRender] = useState(0);

  // Force re-render when settings change
  useEffect(() => {
    const handleAccessibilityChange = () => {
      setForceRender(prev => prev + 1);
    };

    document.addEventListener('accessibilityChanged', handleAccessibilityChange);
    return () => {
      document.removeEventListener('accessibilityChanged', handleAccessibilityChange);
    };
  }, []);

  // Handlers for each setting
  const handleFontSizeChange = (value: number[]) => {
    updateSettings({ fontSize: value[0] });
  };

  const handleLineSpacingChange = (value: number[]) => {
    updateSettings({ lineSpacing: value[0] });
  };

  const handleLetterSpacingChange = (value: number[]) => {
    updateSettings({ letterSpacing: value[0] });
  };

  const handleSpeechRateChange = (value: number[]) => {
    updateSettings({ speechRate: value[0] });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className={`fixed top-4 right-4 z-50 rounded-full ${
            settings.highContrast ? 'bg-black text-white border-white border-2' : ''
          }`}
          title="Accessibility Settings"
          onClick={() => setIsOpen(true)}
        >
          <SettingsIcon className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className={`settings-panel ${settings.highContrast ? 'bg-black text-white border-white' : 'bg-white'}`}>
        <div className="absolute right-4 top-4">
          <Button 
            variant="ghost" 
            size="sm"
            className={`close-button h-6 w-6 p-0 rounded-full ${settings.highContrast ? 'text-white hover:bg-black' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <SheetHeader className="text-center">
          <SheetTitle className={`settings-panel-title text-2xl font-bold ${settings.highContrast ? 'text-white' : ''}`}>
            Accessibility Settings
          </SheetTitle>
        </SheetHeader>
        
        <div className="space-y-10 pt-8">
          <div className="settings-slider space-y-3">
            <div className="flex justify-between mb-2">
              <Label className={`settings-label ${settings.highContrast ? 'text-white' : ''}`}>
                Font Size ({settings.fontSize}%)
              </Label>
            </div>
            <Slider
<<<<<<< HEAD
              value={[settings.fontSize]}
              onValueChange={([value]: [number]) => updateSettings({ fontSize: value })}
              min={75}
              max={200}
              step={25}
=======
              className="w-full"
              defaultValue={[settings.fontSize]}
              value={[settings.fontSize]}
              onValueChange={handleFontSizeChange}
              min={75}
              max={200}
              step={25}
              data-radix-slider-thumb
              data-radix-slider-track 
              data-radix-slider-range
>>>>>>> b7855126dbcd7f0b3a11cb8a31d9763247d22b51
            />
          </div>

          <div className="settings-slider space-y-3">
            <div className="flex justify-between mb-2">
              <Label className={`settings-label ${settings.highContrast ? 'text-white' : ''}`}>
                Line Spacing ({settings.lineSpacing}x)
              </Label>
            </div>
            <Slider
<<<<<<< HEAD
              value={[settings.lineSpacing]}
              onValueChange={([value]: [number]) => updateSettings({ lineSpacing: value })}
              min={1}
              max={3}
              step={0.25}
=======
              className="w-full"
              defaultValue={[settings.lineSpacing]}
              value={[settings.lineSpacing]}
              onValueChange={handleLineSpacingChange}
              min={1}
              max={3}
              step={0.25}
              data-radix-slider-thumb
              data-radix-slider-track 
              data-radix-slider-range
>>>>>>> b7855126dbcd7f0b3a11cb8a31d9763247d22b51
            />
          </div>

          <div className="settings-slider space-y-3">
            <div className="flex justify-between mb-2">
              <Label className={`settings-label ${settings.highContrast ? 'text-white' : ''}`}>
                Letter Spacing ({settings.letterSpacing}px)
              </Label>
            </div>
            <Slider
<<<<<<< HEAD
              value={[settings.letterSpacing]}
              onValueChange={([value]: [number]) => updateSettings({ letterSpacing: value })}
              min={0}
              max={5}
              step={0.5}
=======
              className="w-full"
              defaultValue={[settings.letterSpacing]}
              value={[settings.letterSpacing]}
              onValueChange={handleLetterSpacingChange}
              min={0}
              max={5}
              step={0.5}
              data-radix-slider-thumb
              data-radix-slider-track 
              data-radix-slider-range
>>>>>>> b7855126dbcd7f0b3a11cb8a31d9763247d22b51
            />
          </div>

          <div className="settings-slider space-y-3">
            <div className="flex justify-between mb-2">
              <Label className={`settings-label ${settings.highContrast ? 'text-white' : ''}`}>
                Speech Rate ({settings.speechRate}x)
              </Label>
            </div>
            <Slider
<<<<<<< HEAD
              value={[settings.speechRate]}
              onValueChange={([value]: [number]) => updateSettings({ speechRate: value })}
              min={0.5}
              max={2}
              step={0.1}
=======
              className="w-full"
              defaultValue={[settings.speechRate]}
              value={[settings.speechRate]}
              onValueChange={handleSpeechRateChange}
              min={0.5}
              max={2}
              step={0.1}
              data-radix-slider-thumb
              data-radix-slider-track 
              data-radix-slider-range
>>>>>>> b7855126dbcd7f0b3a11cb8a31d9763247d22b51
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <Label className={`settings-label ${settings.highContrast ? 'text-white' : ''}`}>
              High Contrast
            </Label>
            <Switch
<<<<<<< HEAD
=======
              className="bg-transparent"
>>>>>>> b7855126dbcd7f0b3a11cb8a31d9763247d22b51
              checked={settings.highContrast}
              onCheckedChange={(checked: boolean) => updateSettings({ highContrast: checked })}
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <Label className={`settings-label ${settings.highContrast ? 'text-white' : ''}`}>
              Use OpenDyslexic Font
            </Label>
            <Switch
<<<<<<< HEAD
=======
              className="bg-transparent"
>>>>>>> b7855126dbcd7f0b3a11cb8a31d9763247d22b51
              checked={settings.useOpenDyslexic}
              onCheckedChange={(checked: boolean) => updateSettings({ useOpenDyslexic: checked })}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}