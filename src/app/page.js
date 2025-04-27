"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
import Link from "next/link";
import { FileText, Eye, Headphones, FileEdit, FolderOpen } from "lucide-react";
import { useAccessibility } from "@/contexts/AccessibilityContext";

export default function Home() {
  const { settings } = useAccessibility();
  
  const features = [
    {
      title: "Reading Tests",
      description: "Assess reading speed and comprehension with AI-powered analytics.",
      icon: <FileText className="w-6 h-6" />,
      href: "/reading-test"
    },
    {
      title: "Contrast Test",
      description: "Find the most comfortable text and background color combinations.",
      icon: <Eye className="w-6 h-6" />,
      href: "/contrast-test"
    },
    {
      title: "Dictation Test",
      description: "Practice writing through speech-to-text with instant feedback.",
      icon: <Headphones className="w-6 h-6" />,
      href: "/dictation-test"
    },
    {
      title: "Notes Proofreading",
      description: "AI-powered correction for spelling and grammar.",
      icon: <FileEdit className="w-6 h-6" />,
      href: "/proofreading"
    },
    {
      title: "Open Text File",
      description: "Import and analyze text files with dyslexia-friendly formatting.",
      icon: <FolderOpen className="w-6 h-6" />,
      href: "/open-file"
    }
  ];

  // Define styles for high contrast mode
  const cardStyle = settings?.highContrast 
    ? "bg-black border-2 border-white transition-all duration-300 hover:border-primary"
    : "transition-all duration-300 hover:border-primary/50";
  
  const textStyle = settings?.highContrast ? "text-white" : "";
  const iconContainerStyle = settings?.highContrast ? "p-2.5 w-fit rounded-md bg-black border border-white mb-4" : "p-2.5 w-fit rounded-md bg-primary/5 mb-4";
  const iconStyle = settings?.highContrast ? "text-white" : "";
  const buttonStyle = settings?.highContrast 
    ? "w-full text-base py-3 text-white hover:bg-gray-900"
    : "w-full text-base py-3";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 font-['OpenDyslexic']">
      <div className="max-w-7xl mx-auto px-6">
        <header className="py-12">
          <NavigationMenu className="w-full">
            <NavigationMenuList>
              <NavigationMenuItem>
                <h1 className={`text-3xl font-bold pt-4 ${textStyle}`}>DyslexiAssist</h1>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </header>

        <main className="space-y-8">
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card 
                key={feature.title} 
                className={cardStyle}
              >
                <Link href={feature.href}>
                  <CardHeader className="p-6">
                    <div className={iconContainerStyle}>
                      <div className={iconStyle}>{feature.icon}</div>
                    </div>
                    <CardTitle className={`text-xl mb-3 ${textStyle}`}>{feature.title}</CardTitle>
                    <CardDescription className={`text-base leading-relaxed ${settings?.highContrast ? 'text-gray-300' : ''}`}>
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <Button 
                      variant={settings?.highContrast ? "outline" : "ghost"}
                      className={buttonStyle}
                    >
                      Get Started →
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </section>
        </main>

        <footer className="mt-12 text-center text-base">
          <p className={settings?.highContrast ? "text-white" : "text-muted-foreground"}>
            © 2025 DyslexiAssist. Making reading accessible for everyone.
          </p>
        </footer>
      </div>
    </div>
  );
}
