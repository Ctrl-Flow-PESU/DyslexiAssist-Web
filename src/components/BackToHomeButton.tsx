'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function BackToHomeButton() {
  const { settings } = useAccessibility();
  
  return (
    <Link href="/">
      <Button 
        variant="ghost" 
        className={`mb-6 ${settings.highContrast 
          ? "text-foreground hover:text-white hover:bg-black" 
          : "hover:bg-accent"}`}
        size="default"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>
    </Link>
  );
} 