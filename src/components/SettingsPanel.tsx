import { Settings as SettingsIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function SettingsPanel() {
  const { settings, updateSettings } = useAccessibility();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed top-4 right-4 z-50 rounded-full"
          title="Accessibility Settings"
        >
          <SettingsIcon className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="flex items-center justify-between">
          <SheetTitle className="">Accessibility Settings</SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6 py-6">
          <div className="space-y-2">
            <Label className="">Font Size ({settings.fontSize}%)</Label>
            <Slider
                          value={[settings.fontSize]}
                          onValueChange={([value]: [number]) => updateSettings({ fontSize: value })}
                          min={75}
                          max={200}
                          step={25}
                          className="" defaultValue={undefined}            />
          </div>

          <div className="space-y-2">
            <Label className="">Line Spacing ({settings.lineSpacing}x)</Label>
            <Slider
                          value={[settings.lineSpacing]}
                          onValueChange={([value]: [number]) => updateSettings({ lineSpacing: value })}
                          min={1}
                          max={3}
                          step={0.25} className={undefined} defaultValue={undefined}            />
          </div>

          <div className="space-y-2">
            <Label className="">Letter Spacing ({settings.letterSpacing}px)</Label>
            <Slider
                          value={[settings.letterSpacing]}
                          onValueChange={([value]: [number]) => updateSettings({ letterSpacing: value })}
                          min={0}
                          max={5}
                          step={0.5} className={undefined} defaultValue={undefined}            />
          </div>

          <div className="space-y-2">
            <Label className="">Speech Rate ({settings.speechRate}x)</Label>
            <Slider
                          value={[settings.speechRate]}
                          onValueChange={([value]: [number]) => updateSettings({ speechRate: value })}
                          min={0.5}
                          max={2}
                          step={0.1} className={undefined} defaultValue={undefined}            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="">High Contrast</Label>
            <Switch
                          checked={settings.highContrast}
                          onCheckedChange={(checked: any) => updateSettings({ highContrast: checked })} className={undefined}            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="">Use OpenDyslexic Font</Label>
            <Switch
                          checked={settings.useOpenDyslexic}
                          onCheckedChange={(checked: any) => updateSettings({ useOpenDyslexic: checked })} className={undefined}            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}